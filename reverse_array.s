.section .data 
array1: .space 32  // allocate 16 bytes
.secton .text  
.global main 

main:
  // program to reverse an array.

  // first lets create an array of size 8
  // then allocate values 1 to 8 to them
  // using a loop

  mov x1, =array1 // mov array 1 address into x1 register.
  
  // we will be looping 8 times, and the integers are 4 bytes.

  // use w register since they are 32 bits.
  // Then we can easily store 4 bytes (int) at a time
  mov w0, #0

  loop:
    // so x1 is the pointer and x0 is the increment.

    // we will increment by 4 and change the value in the
    // array. Also lets fill the array with the value of w2
    // as well.

    // branch back to loop if we aren't done with
    // all 32 numbers yet. 
   
    // store w0 in address x1 with offset w0
    // then increment w0 offset by 4 (4 byte index)
    // and so at the end of the loop the array should
    // be [0, 4, 8, 12, 16, 20, 24, 28]  
    str w0, [x1, w0]
    add w0, w0, #4
    cmp w0, #32
    bl loop
  
  // Now time to reverse.

  // To reverse the array we will
  // use some simple math.

  // so we have to do 2 things on each
  // iteration:
  // 1. get the 2 indexes we need to swawp

  // 2. do a swap.

  // getting the indexes is easy. We can do
  // a loop from 0 to half way through the 
  // array and lets say it uses w0, then we 
  // can do x1 + w0 for the index, and then
  // x1 + 32 - 4 - w0 which gives us the second 
  // index. If the total ints is odd, it doesn't
  // matter since we don't need to change middle num.
  mov w0, #0
  reverse:

    // we have 8 numbers, so only loop n / 2 so 4 times
    // so cmp and check if w0 is less than 16, so index 0
    // 4, 8, and 12 will be swapped.

    // swap by storing current value into a register, then
    // setting other value to it, thn other index to stored val.

    // so load into w1 the first index you want to swap
    ldr w1, [x1, w0]

    // load the second index. but since we need 32 - 4 - w0 we do that
    // first

    mov w2, #0

    add w2, w2, 28

    sub w2, w2, w0

    // now w2 should have the value 32 - 4 - w0

    ldr w3, [x1, w2]

    // so w3 now has the value of the second element

    // now we want to store the first element value (w1 now)
    // into the second address (address is stored in w2)

    // reference:
    // w1 = first Element
    // w3 = second element
    // [x1, w0] = first index
    // [x1, w2] = second index

    // so store first elemen into second address

    str w1, [x1, w2]

    // store the second one into the first one 

    str w3, [x1, w0]

    // increment the pointer
    add w0, w0, #4

    // check if the pointer is 
    // greater than or equal to 
    // 16 (more than half way)
    // then exit

    cmp w0, #16

    blt loop

  
  ret