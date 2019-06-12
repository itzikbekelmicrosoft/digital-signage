import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faThLarge, faTh } from '@fortawesome/free-solid-svg-icons'
import GridLayout from 'react-grid-layout'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import EditableWidget from '../components/Admin/EditableWidget'
import WidthProvider from '../components/Widgets/WidthProvider'
import DropdownButton from '../components/DropdownButton'

import { Form, Switch } from '../components/Form'

import Widgets from '../widgets'

import { addWidget, getWidgets, deleteWidget, updateWidget } from '../actions/widgets'
import { protect } from '../helpers/auth.js'
import { display } from '../stores'

const GridLayoutWithWidth = WidthProvider(GridLayout)

class Layout extends React.Component {
  static async getInitialProps({ req, query }) {
    const host =
      req && req.headers && req.headers.host ? 'http://' + req.headers.host : window.location.origin
    const displayId = query && query.display
    const widgets = await getWidgets(displayId, host)

    return { widgets, displayId }
  }

  constructor(props) {
    super(props)
    this.state = {
      widgets: props.widgets || []
    }
  }

  componentDidMount() {
    const { displayId } = this.props
    display.setId(displayId)
  }

  refresh = () => {
    return getWidgets(display.id).then(widgets => {
      this.setState({ widgets })
    })
  }

  addWidget = type => {
    const widgetDefinition = Widgets[type]
    return addWidget(display.id, type, widgetDefinition && widgetDefinition.defaultData).then(
      this.refresh
    )
  }

  deleteWidget = id => {
    return deleteWidget(id).then(this.refresh)
  }

  onLayoutChange = layout => {
    for (const widget of layout) {
      updateWidget(widget.i, {
        x: widget.x,
        y: widget.y,
        w: widget.w,
        h: widget.h
      })
    }
  }

  render() {
    const { widgets } = this.state
    const { loggedIn } = this.props
    const layout = widgets.map(widget => ({
      i: widget._id,
      x: widget.x || 0,
      y: widget.y || 0,
      w: widget.w || 1,
      h: widget.h || 1
    }))

    return (
      <Frame loggedIn={loggedIn}>
        <div className={'head'}>
          <h1>Layout for</h1>{' '}
          <div className='editable-title'>
            <input
              className='input'
              placeholder='Unnamed Display'
              value={display && display.name}
              onChange={event => {
                const target = event.target
                const name = target && target.value
                display.updateName(name)
              }}
              onClick={e => {
                if (e) e.stopPropagation()
              }}
              size={display && display.name && display.name.length}
            />
            <div className='icon'>
              <FontAwesomeIcon icon={faPencilAlt} fixedWidth color='#828282' />
            </div>
          </div>
          <DropdownButton
            icon='plus'
            text='Add Widget'
            onSelect={this.addWidget}
            choices={Object.keys(Widgets).map(widget => ({
              key: widget,
              name: Widgets[widget].name,
              icon: Widgets[widget].icon
            }))}
          />
        </div>
        <div className='settings'>
          <Form>
            <Switch
              checkedLabel={'Compact'}
              uncheckedLabel={'Spaced'}
              checkedIcon={faTh}
              uncheckedIcon={faThLarge}
              checked={display.layout == 'spaced'}
              onChange={(name, checked) => display.updateLayout(checked ? 'spaced' : 'compact')}
            />
          </Form>
        </div>
        <div className='layout'>
          <GridLayoutWithWidth
            layout={layout}
            cols={6}
            onLayoutChange={this.onLayoutChange}
            draggableCancel={'.ReactModalPortal,.controls'}
          >
            {widgets.map(widget => (
              <div key={widget._id}>
                <EditableWidget
                  id={widget._id}
                  type={widget.type}
                  onDelete={this.deleteWidget.bind(this, widget._id)}
                />
              </div>
            ))}
          </GridLayoutWithWidth>
        </div>
        <style jsx>
          {`
            h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              color: #4f4f4f;
              margin: 0px;
              display: inline-block;
              margin-right: 16px;
            }
            .head {
              margin-bottom: 24px;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .layout {
              background: #dfdfdf;
              border-radius: 8px;
            }
            .editable-title {
              display: inline-block;
              position: relative;
              margin-right: 16px;
              border-bottom: 3px solid #aaa;
            }
            .editable-title .input {
              font-family: 'Open Sans', sans-serif;
              color: #666;
              background-color: transparent;
              min-height: 40px;
              border: none;
              outline: none;
              margin-right: 24px;
              font-size: 24px;
              font-weight: 600;
            }
            .editable-title .icon {
              position: absolute;
              right: 8px;
              top: 50%;
              margin-top: -8px;
            }
          `}
        </style>
      </Frame>
    )
  }
}

export default protect(view(Layout))
