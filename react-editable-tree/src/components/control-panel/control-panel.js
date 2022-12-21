import React from 'react'
import './control-panel.css'

const ControlPanel = (props) => {
  const { hasSaved, saveStateAsDrl, saveState, loadState } = props

  return (
    <div className='ControlPanel'>
      <button className='ControlPanel-Button ControlPanel-Button_save' onClick={saveStateAsDrl}>
        Save as drl
      </button>
      <button className='ControlPanel-Button ControlPanel-Button_save' onClick={saveState}>
        Save as json
      </button>
      {/* <button className='ControlPanel-Button ControlPanel-Button_load' onClick={loadState}>
        Load
      </button> */}
    </div>
  )
}

export default ControlPanel
