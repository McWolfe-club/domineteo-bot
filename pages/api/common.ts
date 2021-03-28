/** Dont use Acknowledge or ChannelMessage. Depracted both */
export enum InteractionResType {
   'Pong' = 1,
    'Acknowledge', // deprecated
    'ChannelMessage', // deprecated
    'ChannelMessageWithSource',
    'DeferredChannelMessageWithSource',
}

export enum PlayerController {
    'Human' = 1,
    'AI'
}

export interface Nation {
    nationid: number;
    name: string;
    epithet: string;
    pretender_nationid: number;
    controller: PlayerController;
    ailevel: number;
    // 0: not played; 1: unfinished; 2: done
    turnplayed: '0' | '1' | '2';
    filename: string;
}
