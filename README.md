# node-red-contrib-blynk-mg
a simple node-red Blynk node with flexible token and pins configuration
 
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

you can also check the [npmjs package page](https://www.npmjs.com/package/node-red-contrib-blynk-mg).

# Features!

  - Thip node-red package allows users to pass Blynk token and pin as part of the message. For instance:
  ```
msg = {
    'token' : ['token1', 'token-2'],
    'payload' : ['value-0' , 'value-1' , 'value-2', 'value-3'],
    'pin' : [0, 1, 2, 3]
    }   
```
  When the above message is recieved, the node will send the payload 4 messages, to the pin list, one for each pin. all messages will be sent to each token in the msg.token list.
  If msg.payload is longer than msg.pin => the node will send the first payload messages until pins list is used.
  
  | msg.payload | pl-0                    | pl-1                   | pl-2 | pl-3 |
  | msg.pin     | 0                       | 1                      | 2    | 3    |
  | result      | send 'pl-0'  to v-pin-0 | send 'pl-1' to v-pin-1 | -    | -    |

  if msg.pin is longer than payload => the node will send 0 for the pins that has no match in payload list.
  
  | msg.payload | pl-0                    | pl-1                   |                    |                    |
  | msg.pin     | 0                       | 1                      | 2                  | 3                  |
  | result      | send 'pl-0'  to v-pin-0 | send 'pl-1' to v-pin-1 | send 0 to  v-pin-2 | send 0 to  v-pin-3 |

# Installation
in the (Node-red)[] installation directory run this command:

```
$ npm i node-red-contrib-blynk-mg
```


# Todos for next releases

 - improve the user experience and how the msg is consumed.
