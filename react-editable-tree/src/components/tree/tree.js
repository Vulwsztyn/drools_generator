import React, { Component } from 'react'
import TreeNode from '../tree-node'
import AddButton from '../add-button'
import ControlPanel from '../control-panel'
// import TextView from '../text-view'
import './tree.css'

class Tree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nodes: this.initializedСopy(this.props.data),
      savedNodes: [],
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.addRootElement = this.addRootElement.bind(this)
    this.addChild = this.addChild.bind(this)
    this.removeNode = this.removeNode.bind(this)
    this.saveStateAsDrl = this.saveStateAsDrl.bind(this)
    this.saveState = this.saveState.bind(this)
    this.loadState = this.loadState.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.nodesToString = this.nodesToString.bind(this)
  }

  initializedСopy(nodes, location) {
    const nodesCopy = []
    for (let i = 0; i < nodes.length; i++) {
      const { children, title } = nodes[i]
      const hasChildren = children !== undefined
      const id = location ? `${location}.${i + 1}` : `${i + 1}`
      nodesCopy[i] = {
        children: hasChildren ? this.initializedСopy(children, id) : undefined,
        changeTitle: this.changeTitle(id),
        removeNode: this.removeNode(id),
        addChild: this.addChild(id),
        id,
        title,
      }
    }
    return nodesCopy
  }

  changeTitle(id) {
    return (newTitle) => {
      id = id.split('.').map((str) => parseInt(str))
      const nodes = this.initializedСopy(this.state.nodes)
      let changingNode = nodes[id[0] - 1]

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1]
        }
      }

      changingNode.title = newTitle
      this.setState({ nodes })
    }
  }

  addRootElement() {
    const id = this.state.nodes.length ? `${this.state.nodes.length + 1}` : '1'
    const newNode = {
      children: undefined,
      changeTitle: this.changeTitle(id),
      removeNode: this.removeNode(id),
      addChild: this.addChild(id),
      id,
      title: '',
    }

    const nodes = [...this.state.nodes, newNode]
    this.setState({ nodes })
  }

  addChild(id) {
    return () => {
      id = id.split('.').map((str) => parseInt(str))
      const nodes = this.initializedСopy(this.state.nodes)
      let changingNode = nodes[id[0] - 1]

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1]
        }
      }

      if (changingNode.children === undefined) {
        changingNode.children = []
      }

      id = `${id.join('.')}.${changingNode.children.length + 1}`

      changingNode.children = [
        ...changingNode.children,
        {
          children: undefined,
          changeTitle: this.changeTitle(id),
          removeNode: this.removeNode(id),
          addChild: this.addChild(id),
          id,
          title: '',
        },
      ]

      this.setState({ nodes })
    }
  }

  removeNode(id) {
    return () => {
      id = id.split('.').map((str) => parseInt(str))
      const nodes = this.initializedСopy(this.state.nodes)

      if (id.length === 1) {
        const newNodes = [...nodes.slice(0, [id[0] - 1]), ...nodes.slice(id[0])]

        this.setState({ nodes: this.initializedСopy(newNodes) })
      } else {
        let changingNode = nodes[id[0] - 1]

        for (let i = 2; i < id.length; i++) {
          changingNode = changingNode.children[id[i - 1] - 1]
        }

        const index = id[id.length - 1] - 1

        const newChildren = [...changingNode.children.slice(0, index), ...changingNode.children.slice(index + 1)]
        changingNode.children = newChildren

        this.setState({ nodes: this.initializedСopy(nodes) })
      }
    }
  }

  downloadTxtFile(text, filename) {
    const element = document.createElement('a')
    const file = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  saveStateAsDrl() {
    const nodes = this.simplify(this.state.nodes)

    const rootQuestion = (pytanie, odpowiedzi) => `rule "${pytanie}"
    when
    then
    ArrayList<String> warianty = new ArrayList<>();${odpowiedzi.map((e) => `\n    warianty.add("${e}");`).join('')}
    Odpowiedz odpowiedz = zapytaj(frame, kcontext.getKieRuntime(), "${pytanie}", warianty);
    insert (odpowiedz);
end\n\n`
    const question = (nadpytanie, odpowiedz, pytanie, odpowiedzi) => `rule "${nadpytanie} - ${odpowiedz} - ${pytanie}"
    when
    Odpowiedz(pytanie == "${nadpytanie}" && odpowiedz == "${odpowiedz}")
    then
    ArrayList<String> warianty = new ArrayList<>();${odpowiedzi.map((e) => `\n    warianty.add("${e}");`).join('')}
    Odpowiedz odpowiedz = zapytaj(frame, kcontext.getKieRuntime(), "${pytanie}", warianty);
    insert (odpowiedz);
end\n\n`
    const answer = (nadpytanie, odpowiedz, polecane) => `rule "${nadpytanie} - ${odpowiedz} - ${polecane}"
    when
    Odpowiedz(pytanie == "${nadpytanie}" && odpowiedz == "${odpowiedz}")
    then
    polec(frame, kcontext.getKieRuntime(), "${polecane}");
end\n\n`
    const mapShit =
      (nadpytanie = null) =>
      (node) => {
        const children = node.children ? node.children.filter((e) => e.title.length > 0) : []
        const split = node.title.split('-').map((e) => e.trim())
        const odpowiedzi = children
          .map((e) => e.title.split('-')[0].trim())
          .filter((value, index, self) => self.indexOf(value) === index)
        console.log(node.title, split)
        return nadpytanie == null
          ? rootQuestion(split[0], odpowiedzi) + children.map((e) => mapShit(split[0])(e)).join('\n')
          : children.length > 0
          ? question(nadpytanie, split[0], split[1], odpowiedzi) + children.map((e) => mapShit(split[1])(e)).join('\n')
          : answer(nadpytanie, split[0], split[1])
      }
    const mapped =
      `package com.sample
import javax.swing.JOptionPane
import javax.swing.JFrame
import org.kie.api.runtime.KieRuntime
import javax.swing.JRadioButton
import javax.swing.JPanel
global JFrame frame
global javax.swing.JTextArea textArea
import java.util.ArrayList
import java.util.List
import java.util.Arrays;
import java.util.ArrayList
import javax.swing.JLabel;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import com.sample.Odpowiedz;
` +
      nodes.map((e) => mapShit()(e)).join('\n') +
      `function void polec(JFrame frame, KieRuntime krt, String polecane) {
    final JPanel panel = new JPanel();
    String text = polecane;
    panel.add(new JLabel(text));
    JOptionPane.showMessageDialog(frame, panel);
}

function Odpowiedz zapytaj(JFrame frame, KieRuntime krt, String trescPytania, ArrayList odpowiedzi) {

    class Sluchacz implements ItemListener {
        private Odpowiedz odpowiedz;
        private String chosen;
        public Sluchacz(Odpowiedz odp, String wybrana) {
            this.odpowiedz = odp;
            this.chosen = wybrana;
        }

        @Override
        public void itemStateChanged(ItemEvent event) {
            if (event.getStateChange() == ItemEvent.SELECTED) {
                odpowiedz.setOdpowiedz(chosen);
            }
        }
    }
    Odpowiedz odpowiedz = new Odpowiedz(trescPytania, (String) odpowiedzi.get(0));

    final JPanel panel = new JPanel(new GridLayout(0, 1));
    panel.add(new JLabel(trescPytania));

    ArrayList < JRadioButton > listaButtonow = new ArrayList < > ();

    for (int i = 0; i < odpowiedzi.size(); i++) {
        String text = (String) odpowiedzi.get(i);
        JRadioButton nowy = new JRadioButton(text);
        Sluchacz nowySluchacz = new Sluchacz(odpowiedz, text);
        nowy.addItemListener(nowySluchacz);
        listaButtonow.add(nowy);
    }

    listaButtonow.get(0).setSelected(true);
    odpowiedz.setOdpowiedz((String) odpowiedzi.get(0));

    ButtonGroup group = new ButtonGroup();
    for (int i = 0; i < listaButtonow.size(); i++) {
        group.add(listaButtonow.get(i));
        panel.add(listaButtonow.get(i));
    }
    Object[] options = {
        "Proceed"
    };
    if (JOptionPane.showConfirmDialog(frame, panel, "Question", JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE) < 0) {
        odpowiedz.setOdpowiedz("Zakoncz program");
    }

    return odpowiedz;
}`

    this.downloadTxtFile(mapped, 'rules.drl')
    console.log(nodes)
    console.log(JSON.stringify(this.simplify(this.state.nodes), undefined, 2))
    this.setState({ savedNodes: this.initializedСopy(this.state.nodes) })
  }

  saveState() {
    // this.setState({ savedNodes: this.initializedСopy(this.state.nodes) })
    this.downloadTxtFile(JSON.stringify(this.initializedСopy(this.state.nodes), undefined, 2), 'rules.json')
  }

  loadState(data) {
    // this.setState({ nodes: this.initializedСopy(this.state.savedNodes) })
    this.setState({ nodes: this.initializedСopy(data) })
  }

  onTextChange(e) {
    this.setState({ nodes: this.initializedСopy(JSON.parse(e.target.value)) })
  }

  nodesToString() {
    return JSON.stringify(this.simplify(this.state.nodes), undefined, 2)
  }

  simplify(nodes) {
    const nodesCopy = []
    for (let i = 0; i < nodes.length; i++) {
      const { children, title } = nodes[i]
      const hasChildren = children !== undefined && children.length > 0
      nodesCopy[i] = {
        title,
        children: hasChildren ? this.simplify(children) : undefined,
      }
    }
    return nodesCopy
  }

  render() {
    const { nodes, savedNodes } = this.state
    const { addRootElement, saveStateAsDrl, saveState, loadState} = this
    const hasSaved = savedNodes.length !== 0

    return (
      <div>
        {/* // <div className="Tree"> */}

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ControlPanel {...{ hasSaved, saveStateAsDrl, saveState, loadState }} />
          <ul className='Nodes'>
            {nodes.map((nodeProps) => {
              const { id, ...others } = nodeProps
              return <TreeNode key={id} {...others} />
            })}
          </ul>
          <AddButton onClick={addRootElement} />
        </div>

        {/* <div className="Tree-RightSide">
                   <TextView
                     value={nodesToString()}
                     onChange={onTextChange}
                   />
               </div> */}
      </div>
    )
  }
}

export default Tree
