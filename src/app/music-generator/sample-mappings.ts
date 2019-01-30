export type SamplesObject = { [note in Note]?: string };

export type SamplesContainer = {
    fileNames: SamplesObject,
    path: string
}

export type Note =
    'C1' |
    'C#1' |
    'D1' |
    'D#1' |
    'E1' |
    'F1' |
    'F#1' |
    'G1' |
    'G#1' |
    'A1';

export type Category =
    'slow' |
    'mid' |
    'fast';


export type Food =
    'cook' |
    'warmup' |
    'order';

export type Loc =
    'home' |
    'home_morning' |
    'home_evening' |
    'bathroom' |
    'bed' |
    'work' |
    'outdoors' |
    'supermarket' |
    'mall' |
    'diner' |
    'classroom';

export function getSicknessSamples(): SamplesContainer {
    return {
        fileNames: {
            'C1': 'cough_1.mp3',
            'C#1': 'cough_2.mp3',
            'D1': 'cough_3.mp3',
            'D#1': 'cough_4.mp3',
            'E1': 'sneeze_1.mp3',
            'F1': 'sneeze_2.mp3',
            'F#1': 'sneeze_3.mp3',
            'G1': 'sneeze_4.mp3'
        },
        path: './assets/audio/everywhere_samples/sickness/'
    }
}

export function getDrinkingSamples(): SamplesContainer {
    return {
        fileNames: {
            'C1': 'drinking_zisch_1.mp3',
            'C#1': 'drinking_zisch_2.mp3',
            'D1': 'drinking_zisch_3.mp3',
            'D#1': 'drinking_zisch_4.mp3'
        },
        path: './assets/audio/everywhere_samples/drinking/'
    }
}

export function getFlushingSamples(): SamplesContainer {
    return {
        fileNames: {
            'E1': 'flush_1.mp3',
            'F1': 'flush_2.mp3',
            'F#1': 'flush_3.mp3',
            'G1': 'flush_4.mp3',
            'G#1': 'flush_5.mp3'
        },
        path: './assets/audio/everywhere_samples/flushing/'
    }
}

export function getNoteToSampleURL(location: Loc, category: Category, food?: Food): SamplesObject {
    switch (location) {
        case 'home':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'knocking_1.mp3',
                        'C#1': 'knocking_2.mp3',
                        'D1': 'knocking_3.mp3',
                        'D#1': 'knocking_4.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'close_door_1.mp3',
                        'C#1': 'close_door_2.mp3',
                        'D1': 'close_door_3.mp3',
                        'D#1': 'close_door_4.mp3',
                        'E1': 'open_door_1.mp3',
                        'F1': 'open_door_2.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'clock_1.mp3',
                        'C#1': 'clock_2.mp3',
                        'D1': 'clock_3.mp3',
                        'D#1': 'clock_4.mp3'
                    };
            }
            break;
        case 'home_evening':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'light_switch_1.mp3',
                        'C#1': 'light_switch_2.mp3',
                        'D1': 'light_switch_3.mp3',
                        'D#1': 'light_switch_4.mp3',
                        'E1': 'light_switch_5.mp3',
                        'F1': 'light_switch_6.mp3',
                        'F#1': 'light_switch_7.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'place_plate_1.mp3',
                        'C#1': 'place_plate_2.mp3',
                        'D1': 'place_plate_3.mp3'
                    };
                case 'fast':
                    if (food != null) {
                        switch (food) {
                            case 'warmup':
                                return {
                                    'C1': 'microwave/microwave.mp3'
                                };
                            case 'order':
                                return {
                                    'C1': 'order/phone_toot_1.mp3',
                                    'C#1': 'order/phone_toot_2.mp3',
                                    'D1': 'order/doorbell_-1.mp3',
                                    'D#1': 'order/doorbell_-2.mp3',
                                    'E1': 'order/doorbell_0.mp3',
                                    'F1': 'order/doorbell_1.mp3',
                                    'F#1': 'order/doorbell_2.mp3'
                                };
                            case 'cook':
                                return {
                                    'C1': 'cooking/cutting_1.mp3',
                                    'C#1': 'cooking/cutting_2.mp3',
                                    'D1': 'cooking/cutting_3.mp3',
                                    'D#1': 'cooking/cutting_4.mp3',
                                    'E1': 'cooking/cutting_5.mp3',
                                    'F1': 'cooking/cutting_6.mp3',
                                    'F#1': 'cooking/fridge_door_1.mp3',
                                    'G1': 'cooking/fridge_door_2.mp3',
                                    'G#1': 'cooking/fridge_door_3.mp3',
                                    'A1': 'cooking/fridge_door_4.mp3'
                                };
                        }
                    }
                    throw new Error('Tried to create evening slot without giving food parameter.');
            }
            break;
        case 'home_morning':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'place_spoon_1.mp3',
                        'C#1': 'place_spoon_2.mp3',
                        'D1': 'place_spoon_3.mp3',
                        'D#1': 'place_spoon_4.mp3',
                        'E1': 'spoon_in_cup_1.mp3',
                        'F1': 'spoon_in_cup_2.mp3',
                        'F#1': 'spoon_in_cup_3.mp3',
                        'G1': 'spoon_in_cup_4.mp3',
                        'G#1': 'spoon_in_cup_5.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'light_switch_1.mp3',
                        'C#1': 'light_switch_2.mp3',
                        'D1': 'light_switch_3.mp3',
                        'D#1': 'light_switch_4.mp3',
                        'E1': 'light_switch_5.mp3',
                        'F1': 'light_switch_6.mp3',
                        'F#1': 'light_switch_7.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'place_cup_1.mp3',
                        'C#1': 'place_cup_2.mp3',
                        'D1': 'place_cup_3.mp3',
                        'D#1': 'place_cup_4.mp3'
                    };
            }
            break;
        case 'bathroom':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'brushing_teeth_1.mp3',
                        'C#1': 'brushing_teeth_2.mp3',
                        'D1': 'brushing_teeth_3.mp3',
                        'D#1': 'brushing_teeth_4.mp3',
                        'E1': 'brushing_teeth_5.mp3',
                        'F1': 'brushing_teeth_6.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'toothbrush_in_cup_1.mp3',
                        'C#1': 'toothbrush_in_cup_2.mp3',
                        'D1': 'toothbrush_in_cup_3.mp3'
                    };
                case 'fast':
                    return null;
            }
            break;
        case 'bed':
            return null;
            break;
        case 'diner':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'place_spoon_1.mp3',
                        'C#1': 'place_spoon_2.mp3',
                        'D1': 'place_spoon_3.mp3',
                        'D#1': 'place_spoon_4.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'clink_glasses_1.mp3',
                        'C#1': 'clink_glasses_2.mp3',
                        'D1': 'clink_glasses_3.mp3',
                        'D#1': 'clink_glasses_4.mp3',
                        'E1': 'clink_glasses_5.mp3',
                        'F1': 'clink_glasses_6.mp3',
                        'F#1': 'clink_glasses_7.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'place_plate_1.mp3',
                        'C#1': 'place_plate_2.mp3',
                        'D1': 'place_plate_3.mp3'
                    };
            }
            break;
        case 'mall':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'shopping_beep_1.mp3',
                        'C#1': 'shopping_beep_2.mp3',
                        'D1': 'shopping_beep_3.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'credit_card_1.mp3',
                        'C#1': 'credit_card_2.mp3',
                        'D1': 'credit_card_3.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'cash_register.mp3'
                    };
            }
            break;
        case 'outdoors':
            return null;
            break;
        case 'work':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'keyboard_1.mp3',
                        'C#1': 'keyboard_2.mp3',
                        'D1': 'keyboard_3.mp3',
                        'D#1': 'keyboard_4.mp3',
                        'E1': 'keyboard_5.mp3',
                        'F1': 'keyboard_6.mp3',
                        'F#1': 'keyboard_7.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'mouse_click_1.mp3',
                        'C#1': 'mouse_click_2.mp3',
                        'D1': 'mouse_click_3.mp3',
                        'D#1': 'mouse_click_4.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'turn_page_1.mp3',
                        'C#1': 'turn_page_2.mp3',
                        'D1': 'turn_page_3.mp3',
                        'D#1': 'turn_page_4.mp3',
                        'E1': 'turn_page_5.mp3'
                    };
            }
            break;
        case 'supermarket':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'shopping_beep_1.mp3',
                        'C#1': 'shopping_beep_2.mp3',
                        'D1': 'shopping_beep_3.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'credit_card_1.mp3',
                        'C#1': 'credit_card_2.mp3',
                        'D1': 'credit_card_3.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'cash_register.mp3'
                    };
            }
            break;
        case 'classroom':
            switch (category) {
                case 'slow':
                    return {
                        'C1': 'keyboard_1.mp3',
                        'C#1': 'keyboard_2.mp3',
                        'D1': 'keyboard_3.mp3',
                        'D#1': 'keyboard_4.mp3',
                        'E1': 'keyboard_5.mp3',
                        'F1': 'keyboard_6.mp3',
                        'F#1': 'keyboard_7.mp3'
                    };
                case 'mid':
                    return {
                        'C1': 'pencil_1.mp3',
                        'C#1': 'pencil_2.mp3',
                        'D1': 'pencil_3.mp3',
                        'D#1': 'pencil_4.mp3'
                    };
                case 'fast':
                    return {
                        'C1': 'turn_page_1.mp3',
                        'C#1': 'turn_page_2.mp3',
                        'D1': 'turn_page_3.mp3',
                        'D#1': 'turn_page_4.mp3',
                        'E1': 'turn_page_5.mp3'
                    };
            }
        default:
            return null;
    }
}
