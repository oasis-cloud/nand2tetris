// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
(RESETM)
@SUM
M=0
(LOOP)
// 获取按键
@24576
D=M
// 未按键
@ELSE
D;JEQ

(IFTHEN)
@SCREEN
D=A
@SUM
D=D+M
M=M+1
A=D
M=-1
@8191
D=A
@SUM

D=M-D
@RESETM
D;JEQ
@LOOP
0;JMP

// 未按键的清除逻辑
(ELSE)
@SCREEN
D=A
@SUM
D=D+M
M=M-1
A=D
M=0
@SUM
D=M
@RESETM
D;JEQ

@LOOP
0;JMP