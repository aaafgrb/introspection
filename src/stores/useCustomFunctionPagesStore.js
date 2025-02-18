import { defineStore } from 'pinia'
import { useFunctionRegistryStore } from './useFunctionRegistryStore'
import { EMPTY_FUNCTION } from '@/lib/customFunctions'
import { toRaw } from 'vue'

export const useCustomFunctionPagesStore = defineStore('custom-function-pages', {
  state: () => (
    {
      draggableBackgroundTemplate: null,
      currentTopPage: null,
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

    //---------------------------BACKGROUND-----------------------------------//
    setDraggableBackgroundTemplate(template) {
      this.draggableBackgroundTemplate = template
    },

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

      let sPos = Math.round(Math.random() * 50) * 10

      //create page object
      const page = {
        id: this._newId(),
        pageName: pageName,
        functionName: def.name,
        docs: def.docs,
        nodes: new Map(),
        connections: new Map(),
        component: {
          startPosition: { x: sPos, y: sPos },
          position: { x: sPos, y: sPos },
          dimensions: { width: 400, height: 300 },
          zIndex: 0,
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
            let oNode = [...page.nodes].find(([_, z]) => z.name == y.data.ref)[1]

            //get/add the output port of that variable
            let oPort = [...oNode.outPorts].find(([_, z]) => z.data.var == y.data.var)
            oPort = oPort ? oPort[1] : this.addPort(page.id, oNode.id, false, { var: y.data.var })

            //create a connection between those ports
            this.addConnection(page.id, x.id, y.id, oNode.id, oPort.id)
          }
        })
      )

      //fix node positions
      let xHeight = []
      let offset = { x: 300, y: 300 }
      let alreadyPassedNodes = [];
      let notEndNodes = [...page.connections].map(([_, e]) => e.outNodeId)
      let endNodes = [...page.nodes].filter(([k, _]) => !notEndNodes.includes(k))

      const iterate = (x, id) => {
        if (alreadyPassedNodes.includes(id)) return;
        let n = page.nodes.get(id)
        let h = xHeight[x] ?? 0
        n.component.position.x = -offset.x * x
        n.component.position.y = offset.y * h
        alreadyPassedNodes.push(id)
        xHeight[x] = h + 1
        n.inPorts.forEach((_v, k, _m) => {
          if (page.connections.has(k)) {
            iterate(x + 1, page.connections.get(k).outNodeId)
          }
        })
      }

      endNodes.forEach(([k, v]) => {
        iterate(0, k)
        xHeight[0] = xHeight.max
      })


      return page;
    },

    removePage(pageId) {
      this.pages.delete(pageId)
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

    setPageName(pageId, value) {
      let p = this.getPage(pageId)
      if (p.pageName != value) {
        p.pageName = value
      }
    },

    setPageDocs(pageId, docs) {
      let p = this.getPage(pageId)
      if (docs.input && p.docs.input_type != docs.input) {
        p.docs.input_type = docs.input
      }
      if (docs.output && p.docs.output_type != docs.output) {
        p.docs.output_type = docs.output
      }
      if (docs.description && p.docs.description != docs.description) {
        p.docs.description = docs.description
      }
      if (docs.example && p.docs.example != docs.example) {
        p.docs.example = docs.example
      }
    },

    setPageFunction(pageId, functionName) {
      let page = this.getPage(pageId)

    },



    pageRightClick(pageId, _e) {
      //clear connecting port
      let page = this.getPage(pageId)
      if (!page.component.connectingPort) return
      this.getPort(pageId, page.component.connectingPort.nodeId, page.component.connectingPort.isInput, page.component.connectingPort.portId).component.beingConnected = false
      page.component.connectingPort = null
    },

    bringPageToTop(pageId) {
      if (this.currentTopPage) {
        if (this.currentTopPage == pageId) return;
        this.getPage(this.currentTopPage).component.zIndex = 0
      }
      this.getPage(pageId).component.zIndex = 1
      this.currentTopPage = pageId
    },

    focusFunctionPage(pageId) {
      let p = this.getPage(pageId).component
      let rx = (-p.position.x - p.dimensions.width / 2) * this.draggableBackgroundTemplate.localZoom + window.innerWidth / 2
      let ry = (-p.position.y - p.dimensions.height / 2) * this.draggableBackgroundTemplate.localZoom + window.innerHeight / 2

      this.draggableBackgroundTemplate.setPosition(rx, ry);
      this.bringPageToTop(pageId)
    },

    resetFunctionPagePosition(pageId) {
      let p = this.getPage(pageId).component
      p.position.x = p.startPosition.x
      p.position.y = p.startPosition.y
      p.dimensions.width = 400
      p.dimensions.height = 300
    },

    setFunctionPageDefaultPosition(pageId, x, y) {
      let p = this.getPage(pageId).component
      p.startPosition.x = x
      p.startPosition.y = y
    },

    resetAllFunctionPagePositions() {
      this.pages.forEach((_v, k, _m) => this.resetFunctionPagePosition(k))
    },

    closeFunctionPage(pageId) {
      this.removePage(pageId)
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