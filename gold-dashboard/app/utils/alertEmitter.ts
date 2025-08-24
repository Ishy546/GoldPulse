import { EventEmitter } from "events";

class AlertEmitter extends EventEmitter {}
const alertEmitter = new AlertEmitter()

export default alertEmitter
