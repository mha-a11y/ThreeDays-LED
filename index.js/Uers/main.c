#include "stm32f10x.h"                  // Device header
#include"Delay.h"


void Serial_Init(void)
{
	// 1. ???? (GPIOA ? USART1)
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_USART1, ENABLE);
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
	
	
	// 2. ?? GPIO PA9 (TX) ???????
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_9;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA, &GPIO_InitStructure);
	
	// 3. ?? GPIO PA10 (RX) ??????????
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_10;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA, &GPIO_InitStructure);
	
	// 4. ??????
	USART_InitTypeDef USART_InitStructure;
	USART_InitStructure.USART_BaudRate = 9600;               // ?????? 115200
	USART_InitStructure.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
	USART_InitStructure.USART_Mode = USART_Mode_Tx | USART_Mode_Rx; // ???????
	USART_InitStructure.USART_Parity = USART_Parity_No;        // ???
	USART_InitStructure.USART_StopBits = USART_StopBits_1;     // 1????
	USART_InitStructure.USART_WordLength = USART_WordLength_8b; // 8???
	USART_Init(USART1, &USART_InitStructure);
	
	// 5. ????
	USART_Cmd(USART1, ENABLE);
	USART1->BRR=0X341;
}


int main(void)
{
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA,ENABLE);
	GPIO_PinRemapConfig(GPIO_Remap_SWJ_NoJTRST, ENABLE);
	GPIO_InitTypeDef GPIO_InitStruture;
	GPIO_InitStruture.GPIO_Mode=GPIO_Mode_Out_PP ;
	GPIO_InitStruture.GPIO_Pin= GPIO_Pin_0 |GPIO_Pin_3    ;
	GPIO_InitStruture.GPIO_Speed= GPIO_Speed_50MHz;
	GPIO_Init(GPIOA,&GPIO_InitStruture);
	
	//GPIO_ResetBits(GPIOA,GPIO_Pin_0);
	//GPIO_SetBits(GPIOA,GPIO_Pin_0);
	//GPIO_WriteBit(GPIOA,GPIO_Pin_0,Bit_SET);
	
	Serial_Init();

	GPIO_SetBits(GPIOA,GPIO_Pin_0);
	
	
	// ? USART ????????
if (RCC_GetFlagStatus(RCC_FLAG_HSERDY) == RESET) {
    // ????????,????????(HSE)?????!
    // ???????????????? HSI ???,????????
    // ???????????????
    GPIO_SetBits(GPIOC, GPIO_Pin_13); 
}
	 while (1)
{
    // 1. ???????? (RXNE = Receive Not Empty)
	
	
	
	  /*USART_SendData(USART1, 'a'); // ????????????? 'a' ???
    while (USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET);
    Delay_ms(1000);*/
    if (USART_GetFlagStatus(USART1, USART_FLAG_RXNE) == SET)
    {
        // 2. ???????????
        uint16_t res = USART_ReceiveData(USART1);
        
        // ----------------------------------------------------
        // ????????:???????????
        // ----------------------------------------------------
        USART_SendData(USART1, res); // ???? res ?????
        
        // ?????? (TXE = Transmit Empty)
        // ????????,????????????
        while (USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET);
        // ----------------------------------------------------

        // 3. ???????
        if (res == 'a') {
            GPIO_SetBits(GPIOA, GPIO_Pin_0); 
        } else if (res == 'b') {
            GPIO_ResetBits(GPIOA, GPIO_Pin_0);
        }
    }
}

	
/*	while (1) {
    if (USART_GetFlagStatus(USART1, USART_FLAG_RXNE) != RESET) {
        // ????????,???????
        USART_ReceiveData(USART1); 
        GPIO_WriteBit(GPIOA, GPIO_Pin_0, (BitAction)(1 - GPIO_ReadOutputDataBit(GPIOA, GPIO_Pin_0)));
    }
}*/

}
