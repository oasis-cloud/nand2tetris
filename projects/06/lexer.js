const fs = require('fs')
function isVariable(char) {
  return /[0-9a-zA-Z\.\_\$\:]/.test(char)
}
function isVariableStart(char) {
  return /[a-zA-Z\.\_\$\:]/.test(char)
}
function isNumber(char) {
  return /[0-9]/.test(char)
}
function isRegister(char) {
  return /[AMD]/.test(char)
}

// const symbols = {
//   "SCREEN":"",
//   "KEYBOARD":"",
//   "R0":"0",
//   "R1":"1",
//   "R2":"2",
//   "R3":"3",
//   "R4":"4",
//   "R5":"5",
//   "R6":"6",
//   "R7":"7",
//   "R8":"8",
//   "R9":"9",
//   "R10":"10",
//   "R11":"11",
//   "R12":"12",
//   "R13":"13",
//   "R14":"14",
//   "R15":"15",
//   "SP":"0",
//   "LCL":"1",
//   "ARG":"2",
//   "THIS":"3",
//   "THAT":"4"
// }

function lexer() {
  let current = 0
  let tokens = []
  let code = fs.readFileSync(process.argv[2], {
    encoding: "utf8"
  })

  let codeLength = code.length

  while (current < codeLength) {

    let char = code[current]
    if (/\s/.test(char)) {
      ++current
      continue
    }
    if (char == '/') {
      char = code[++current]
      if (char != '/') throw "expect /"
      while (char != "\n") {
        char = code[++current]
      }
      continue
    }
    if (char == '@') {
      let at = ""
      char = code[++current]
      if (isNumber(char)) {
        while (char != "\n") {
          if (!isNumber(char)) throw "expect number"
          at += char
          char = code[++current]
        }
      } else if (isVariableStart(char)) {
        while (isVariable(char)) {
          at += char
          char = code[++current]
        }
      } else {
        ++current
      }
      tokens.push({
        type: "AT",
        value: at
      })
      continue
    }
    if (char == "(") {
      tokens.push({
        type: "PAREN",
        value: "("
      })
      ++current
      continue
    }
    if (char == ")") {
      tokens.push({
        type: "PAREN",
        value: ")"
      })
      ++current
      continue
    }
    if (char == "=") {
      tokens.push({
        type: "OPERATOR",
        value: "="
      })
      ++current
      continue
    }
    if (char == "+") {
      tokens.push({
        type: "OPERATOR",
        value: "+"
      })
      ++current
      continue
    }
    if (char == "-") {
      tokens.push({
        type: "OPERATOR",
        value: "-"
      })
      ++current
      continue
    }

    if (char == ";") {
      tokens.push({
        type: "SEMICOLON",
        value: ";"
      })
      ++current
      continue
    }

    if(isRegister(char)) {
      tokens.push({
        type:"REGISTER",
        value:char
      })
      ++current;
      continue;
    }

    if(isNumber(char)) {
      tokens.push({
        type:"NUMBER",
        value:char
      })
      ++current;
      continue;
    }

    if (isVariableStart(char)) {
      let variable = ""
      while (isVariable(char)) {
        variable += char
        char = code[++current]
      }
      tokens.push({
        type: "VARIABLE",
        value: variable
      })
      continue
    }
    throw new TypeError("Unrecognized characters");
  }

  return tokens
}

const tokens = lexer()
// console.log(tokens)

module.exports = lexer