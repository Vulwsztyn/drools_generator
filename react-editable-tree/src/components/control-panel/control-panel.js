import React from 'react'
import './control-panel.css'

const ControlPanel = (props) => {
  const { saveStateAsDrl, saveState, loadState } = props
  const changeHandler = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => {
      console.log('e.target.result', e.target.result)
      loadState(JSON.parse(e.target.result))
    }
  }
  return (
    <div className='ControlPanel'>
      <button className='ControlPanel-Button ControlPanel-Button_save' onClick={saveStateAsDrl}>
        Save as drl
      </button>
      <button className='ControlPanel-Button ControlPanel-Button_save' onClick={saveState}>
        Save as json
      </button>
      <button className='ControlPanel-Button ControlPanel-Button_load' onClick={loadState}>
        <input type='file' name='file' onChange={changeHandler} />
      </button>
    </div>
  )
}

export default ControlPanel
