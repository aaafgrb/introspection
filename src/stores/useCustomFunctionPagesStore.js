import { defineStore } from 'pinia'
import { useFunctionRegistryStore } from './useFunctionRegistryStore'
import { EMPTY_FUNCTION } from '@/lib/customFunctions'
import { toRaw } from 'vue'

export const useCustomFunctionPagesStore = defineStore('custom-function-pages', {
  state: () => (
    {
      pages: new Map(),
      _currentId: 0,
    }
  ),
  getters: {
    getPage: (state) => (pageId) => state.pages.get(pageId),
    getNode: (state) => (pageId, nodeId) => state.pages.get(pageId).nodes.get(nodeId),
    getPort: (state) => (pageId, nodeId, isInput, portId) =>
      isInput ? state.pages.get(pageId).nodes.get(nodeId).inPorts.get(portId) :
        state.pages.get(pageId).nodes.get(nodeId).outPorts.get(portId)
    ,
  },
  actions: {
    _newId() { return this._currentId++ },

    //------------------------------PAGE--------------------------------------//
    addPage(pageName, functionName) {
      //load function definition
      const registry = useFunctionRegistryStore()
      let def = registry.getCustomFunction(functionName)
      if (!def) {
        console.warn(`Custom function ${functionName} not in registry. Loading Empty function.`)
        def = EMPTY_FUNCTION;
      }
      def = structuredClone(toRaw(def))

      //create page object
      const page = {
        id: this._newId(),
        pageName: pageName,
        functionName: def.name,
        docs: def.docs,
        nodes: new Map(),
        connections: new Map(),
        component: {
          position: { x: 0, y: 0 },
          dimensions: { width: 400, height: 300 },
          xIndex: 0,
          connectingPort: null,
        }
      }
      this.pages.set(page.id, page)

      //create nodes
      def.definition.forEach(x => this.addNode(page.id, x))

      //create connections
      //  for each input port
      page.nodes.forEach(x =>
        x.inPorts.forEach(y => {
          if (y.data.ref) { //if it receives data from other node
            //find that node 
            let oNode = Array.from(page.nodes).find(([_, z]) => z.name == y.data.ref)[1]

            //get/add the output port of that variable
            let oPort = Array.from(oNode.outPorts).find(([_, z]) => z.var == y.data.var)
            oPort = oPort ? oPort[1] : this.addPort(page.id, oNode.id, false, { var: y.data.var })

            //create a connection between those ports
            this.addConnection(page.id, x.id, y.id, oNode.id, oPort.id)
          }
        })
      )

      return page;
    },

    setPagePosition(pageId, x, y) {
      let p = this.getPage(pageId).component.position
      p.x = x;
      p.y = y;
    },

    offsetPagePosition(pageId, dx, dy) {
      let p = this.getPage(pageId).component.position
      p.x += dx;
      p.y += dy;
    },

    setPageDimensions(pageId, width, height) {
      let p = this.getPage(pageId).component.dimensions

      p.width = Math.max(width, 200);
      p.height = Math.max(height, 150);
    },

    offsetPageDimensions(pageId, dWidth, dHeight) {
      let p = this.getPage(pageId).component.dimensions
      p.width = Math.max(p.width + dWidth, 200);
      p.height = Math.max(p.height + dHeight, 150);
    },

    pageRightClick(pageId, _e) {
      //clear connecting port
      let page = this.getPage(pageId)
      if (!page.component.connectingPort) return
      this.getPort(pageId, page.component.connectingPort.nodeId, page.component.connectingPort.isInput, page.component.connectingPort.portId).component.beingConnected = false
      page.component.connectingPort = null
    },

    //------------------------------NODE--------------------------------------//
    addNode(pageId, nodeData) {
      //create node object
      const node = {
        id: this._newId(),
        name: nodeData.name,
        operation: nodeData.operation,
        inPorts: new Map(),
        outPorts: new Map(),
        component: {
          position: { x: 100, y: 100 }
        },
      }
      this.getPage(pageId).nodes.set(node.id, node)

      //create input ports
      nodeData.params.forEach(x => this.addPort(pageId, node.id, true, x))

      //create output port
      this.addPort(pageId, node.id, false, { var: "output" })

      return node;
    },

    setNodePosition(pageId, nodeId, x, y) {
      let p = this.getNode(pageId, nodeId).component.position
      p.x = x;
      p.y = y;
    },

    offsetNodePosition(pageId, nodeId, dx, dy) {
      let p = this.getNode(pageId, nodeId).component.position
      p.x += dx;
      p.y += dy;
    },

    //------------------------------PORT--------------------------------------//
    addPort(pageId, nodeId, isInput, portData) {
      const port = {
        id: this._newId(),
        isInput,
        data: portData,
        component: {
          offset: { x: 0, y: 0 },
          beingConnected: false,
        }
      }
      if (isInput)
        this.getNode(pageId, nodeId).inPorts.set(port.id, port)
      else
        this.getNode(pageId, nodeId).outPorts.set(port.id, port)
      return port;
    },

    setPortOffset(pageId, nodeId, isInput, portId, x, y) {
      let p = this.getPort(pageId, nodeId, isInput, portId).component.offset
      p.x = x
      p.y = y
    },

    portCallbackClick(pageId, nodeId, isInput, portId) {
      let page = this.getPage(pageId)

      if (page.component.connectingPort) { //if there is already a connection being made
        if (portId != page.component.connectingPort.portId) { //if the nodes are different
          if (isInput != page.component.connectingPort.isInput) { //if the in/out types are different
            //create the connection
            if (isInput) this.addConnection(pageId, nodeId, portId, page.component.connectingPort.nodeId, page.component.connectingPort.portId)
            else this.addConnection(pageId, page.component.connectingPort.nodeId, page.component.connectingPort.portId, nodeId, portId,)
          }
        } else if (isInput) { //if its the same port and it is input
          //remove the connections from that port
          this.removeConnection(pageId, portId)
        }

        //clear connecting port
        this.getPort(pageId, page.component.connectingPort.nodeId, page.component.connectingPort.isInput, page.component.connectingPort.portId).component.beingConnected = false
        page.component.connectingPort = null
      } else { //if there is no connection being made
        //add connecting port
        page.component.connectingPort = { nodeId, isInput, portId }
        this.getPort(pageId, nodeId, isInput, portId).component.beingConnected = true
      }
    },

    //------------------------------CONNECTION--------------------------------------//
    addConnection(pageId, inNodeId, inPortId, outNodeId, outPortId) {
      const connection = {
        id: inPortId,
        inNodeId, inPortId, outNodeId, outPortId
      }
      this.getPage(pageId).connections.set(connection.id, connection)
      return connection;
    },

    removeConnection(pageId, inPortId) {
      this.getPage(pageId).connections.delete(inPortId)
    }
  }
})