import SockJSClass = __SockJSClient.SockJSClass;
/**
 * Created by Dummy on 8/1/16.
 */
import * as SockJS from "sockjs-client";

export class EventBus {
  private pingTimerID:number;
  sockJSConn:SockJSClass;
  state:EventBusState;
  private handlers:any;
  private replyHandlers:any;
  defaultHeaders:any;

  onError:(err:any) => any;
  onOpen:() => any;
  onClose:(e:any) => any;

  constructor(url:string, options?:any) {
    options = options || {};

    var pingInterval = options.vertxbus_ping_interval || 5000;

    // attributes
    this.sockJSConn = new SockJS(url, null, options);
    this.state = EventBusState.CONNECTING;
    this.handlers = {};
    this.replyHandlers = {};
    this.defaultHeaders = null;

    // default event handlers
    this.onError = (err:any) => {
      try {
        console.error(err);
      } catch (e) {
        // dev tools are disabled so we cannot use console on IE
      }
    };

    var sendPing = () => this.sockJSConn.send(JSON.stringify({type: 'ping'}));

    this.sockJSConn.onopen = () => {
      // Send the first ping then send a ping every pingInterval milliseconds
      sendPing();
      this.pingTimerID = setInterval(sendPing, pingInterval);
      this.state = EventBusState.OPEN;
      this.onOpen && this.onOpen();
    };

    this.sockJSConn.onclose = function (e) {
      this.state = EventBusState.CLOSED;
      if (this.pingTimerID) clearInterval(this.pingTimerID);
      this.onClose && this.onClose(e);
    };

    this.sockJSConn.onmessage = function (e) {
      var json = JSON.parse(e.data);

      // define a reply function on the message itself
      if (json.replyAddress) {
        Object.defineProperty(json, 'reply', {
          value: (message, headers, callback) => {
            this.send(json.replyAddress, message, headers, callback);
          }
        });
      }

      if (this.handlers[json.address]) {
        // iterate all registered handlers
        var handlers = this.handlers[json.address];
        for (var i = 0; i < handlers.length; i++) {
          if (json.type === 'err') {
            handlers[i]({failureCode: json.failureCode, failureType: json.failureType, message: json.message});
          } else {
            handlers[i](null, json);
          }
        }
      } else if (this.replyHandlers[json.address]) {
        // Might be a reply message
        var handler = this.replyHandlers[json.address];
        delete this.replyHandlers[json.address];
        if (json.type === 'err') {
          handler({failureCode: json.failureCode, failureType: json.failureType, message: json.message});
        } else {
          handler(null, json);
        }
      } else {
        if (json.type === 'err') {
          this.onError(json);
        } else {
          try {
            console.warn('No handler found for message: ', json);
          } catch (e) {
            // dev tools are disabled so we cannot use console on IE
          }
        }
      }
    }
  }

  send(address, message, headers, callback) {
    // are we ready?
    if (this.state != EventBusState.OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (typeof headers === 'function') {
      callback = headers;
      headers = {};
    }

    var envelope:any = {
      type: 'send',
      address: address,
      headers: EventBus.mergeHeaders(this.defaultHeaders, headers),
      body: message
    };

    if (callback) {
      var replyAddress = EventBus.makeUUID();
      envelope.replyAddress = replyAddress;
      this.replyHandlers[replyAddress] = callback;
    }

    this.sockJSConn.send(JSON.stringify(envelope));
  }

  publish(address, message, headers) {
    // are we ready?
    if (this.state != EventBusState.OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    this.sockJSConn.send(JSON.stringify({
      type: 'publish',
      address: address,
      headers: EventBus.mergeHeaders(this.defaultHeaders, headers),
      body: message
    }));
  }

  close() {
    this.state = EventBusState.CLOSING;
    this.sockJSConn.close();
  }

  registerHandler(address, headers, callback) {
    // are we ready?
    if (this.state != EventBusState.OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (typeof headers === 'function') {
      callback = headers;
      headers = {};
    }

    // ensure it is an array
    if (!this.handlers[address]) {
      this.handlers[address] = [];
      // First handler for this address so we should register the connection
      this.sockJSConn.send(JSON.stringify({
        type: 'register',
        address: address,
        headers: EventBus.mergeHeaders(this.defaultHeaders, headers)
      }));
    }

    this.handlers[address].push(callback);
  }

  unregisterHandler(address, headers, callback) {
    // are we ready?
    if (this.state != EventBusState.OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    var handlers = this.handlers[address];

    if (handlers) {

      if (typeof headers === 'function') {
        callback = headers;
        headers = {};
      }

      var idx = handlers.indexOf(callback);
      if (idx != -1) {
        handlers.splice(idx, 1);
        if (handlers.length === 0) {
          // No more local handlers so we should unregister the connection
          this.sockJSConn.send(JSON.stringify({
            type: 'unregister',
            address: address,
            headers: EventBus.mergeHeaders(this.defaultHeaders, headers)
          }));

          delete this.handlers[address];
        }
      }
    }
  }

  private static makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a, b) {
      return b = Math.random() * 16, (a == 'y' ? b & 3 | 8 : b | 0).toString(16);
    });
  }

  private static mergeHeaders(defaultHeaders, headers) {
    if (defaultHeaders) {
      if (!headers) {
        return defaultHeaders;
      }

      for (var headerName in defaultHeaders) {
        if (defaultHeaders.hasOwnProperty(headerName)) {
          // user can overwrite the default headers
          if (typeof headers[headerName] === 'undefined') {
            headers[headerName] = defaultHeaders[headerName];
          }
        }
      }
    }

    // headers are required to be a object
    return headers || {};
  }
}

export enum EventBusState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}
