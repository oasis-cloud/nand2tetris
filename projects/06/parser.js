const lexer = require('./lexer')

function parser(tokens) {
  let lookAhead = 0
  let ast = {
    type: "Program",
    body: []
  }

  function walk() {
    let token = tokens[lookAhead]
    if (token.type == 'AT') {
      token = tokens[++lookAhead]
      return {
        type: "A_COMMAND",
        value: token.value
      }
    }
    if (token.type == "PAREN" && token.value == "(") {
      token = tokens[++lookAhead]
      let node = {
        type: "L_COMMAND",
        value: token.value
      }
      token = tokens[++lookAhead]
      if (token.type != 'PAREN' && (token.type == 'PAREN' && token.value != ")")) {
        throw new TypeError(token.type);
      }
      return node
    }
    if (token.type == "REGISTER") {
      return {
        type: "C_COMMAND",
        value: token.value
      }
    }
    if (token.type == "NUMBER" && token.value == "0") {
      token = tokens[++lookAhead]
      if(token.type == "SEMICOLON") {
        token = tokens[++lookAhead]
        if(token.type == "VARIABLE" && token.value == "JMP") {
          return {
            type: "C_COMMAND",
            value: {
              "DEST": "null",
              "COMP":"null",
              "JMP":"JMP"
            }
          }
        }
      } else {
        throw new TypeError("expect ;")
      }

    }
    console.log(tokens[lookAhead])
  }

  while (lookAhead < tokens.length) {
    ast.body.push(walk())
  }

  return ast
}

parser(lexer())