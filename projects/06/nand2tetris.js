const fs = require("fs");

const Utils = {
  isWhiteSpace(char) {
    return /\s/.test(char);
  },
};
class Lexer {
  constructor() {
    this.tokens = [];
    this.code = fs.readFileSync(process.argv[2], {
      encoding: "utf8",
    });
    this.idx = 0;
    this.lookAhead = this.code[this.idx];
  }
  hasNextToken() {
    return this.idx < this.code.length;
  }
  consume() {
    ++this.idx;
    this.lookAhead = this.code[this.idx];
  }
  back() {
    --this.idx;
    this.lookAhead = this.code[this.idx];
  }
  comment() {
    if (this.lookAhead == "/") {
      do {
        this.consume();
      } while (this.lookAhead != "\n");
    } else {
      this.back();
    }
  }
  acommand() {
    let command = "";
    do {
      command += this.lookAhead;
      this.consume();
    } while (this.lookAhead != "\n");
    this.tokens.push({
      type: "A_COMMAND",
      value: command,
    });
  }
  ccommand() {
    let command = "";
    do {
      command += this.lookAhead;
      this.consume();
    } while (this.lookAhead != "\n");
    this.tokens.push({
      type: "C_COMMAND",
      value: command,
    });
  }
  symbol() {
    let command = "";
    do {
      command += this.lookAhead;
      this.consume();
    } while (this.lookAhead != ")");
    this.tokens.push({
      type: "L_COMMAND",
      value: command,
    });
  }
  nextToken() {
    // if (this.hasNextToken()) {
    while (this.hasNextToken()) {
      if (Utils.isWhiteSpace(this.lookAhead)) {
        this.consume();
        continue;
      }
      if (this.lookAhead == "/") {
        this.consume();
        this.comment();
      } else if (this.lookAhead == "@") {
        this.acommand();
      } else if (this.lookAhead == "(") {
        this.symbol();
      } else if (/[A|M|D]/.test(this.lookAhead)) {
        this.ccommand();
      } else {
        this.consume();
      }
    }
    // }
    return null;
  }
}

class Parser {
  constructor() {}
  hasMoreCommands() {}
  advance() {
    if (this.hasMoreCommands()) {
      return "";
    }
  }
  commandType() {
    // A_COMMAND
    // C_COMMAND
    // L_COMMAND
    return "";
  }
  getsymbol() {
    if (
      this.commandType() == "A_COMMAND" ||
      this.commandType() == "C_COMMAND"
    ) {
      return "@R0";
    }
  }
  dest() {
    if (this.commandType() == "C_COMMAND") {
      return "A|D|M";
    }
  }
  comp() {
    if (this.commandType() == "C_COMMAND") {
      return "";
    }
  }
  jump() {
    if (this.commandType() == "C_COMMAND") {
      return "";
    }
  }
}

const Code = {
  dest(d) {
    const Dest = {
      null: "000",
      M: "001",
      D: "010",
      MD: "011",
      A: "100",
      AM: "101",
      AD: "110",
      AMD: "111",
    };
    return Dest[d];
  },
  comp(c) {
    const Comp = {
      0: "101010",
      1: "111111",
      "-1": "111010",
      D: "001100",
      A: "110000",
      "!D": "001101",
      "!A": "110001",
      "-D": "001111",
      "-A": "110011",
      "D+1": "011111",
      "A+1": "110111",
      "D-1": "001110",
      "A-1": "110010",
      "D+A": "000010",
      "D-A": "010011",
      "A-D": "000111",
      "D&A": "000000",
      "D|A": "010101",
    };
    return Comp[c];
  },
  jump(j) {
    const Jmp = {
      null: "000",
      JGT: "001",
      JEQ: "010",
      JGE: "011",
      JLT: "100",
      JNE: "101",
      JLE: "110",
      JMP: "111",
    };
    return Jmp[j];
  },
};

const lexer = new Lexer();

lexer.nextToken();
lexer.nextToken();
lexer.nextToken();
lexer.nextToken();
lexer.nextToken();
lexer.nextToken();

console.log(lexer.tokens);
