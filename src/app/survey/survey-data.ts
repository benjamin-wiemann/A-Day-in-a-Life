export const surveyJSON =
{
    pages: [
        {
            name: 'page1',
            elements: [
                {
                    type: 'radiogroup',
                    name: 'living_place',
                    title: 'Where do you live?',
                    isRequired: true,
                    choices: [
                        {
                            value: 'city',
                            text: 'City'
                        },
                        {
                            value: 'country',
                            text: 'Village / Countryside'
                        }
                    ]
                }
            ]
        },
        {
            name: 'page2',
            elements: [
                {
                    type: 'matrixdynamic',
                    name: 'spot',
                    title: 'On which of these spots did your day take place?',
                    isRequired: true,
                    columns: [
                        {
                            name: 'Column 1'
                        }
                    ],
                    choices: [
                        {
                            value: 'home',
                            text: 'Home'
                        },
                        {
                            value: 'work',
                            text: 'Work'
                        },
                        {
                            value: 'outdoors',
                            text: 'Outdoors'
                        },
                        {
                            value: 'supermarket',
                            text: 'Supermarket'
                        },
                        {
                            value: 'mall',
                            text: 'Shopping Mall'
                        },
                        {
                            value: 'diner',
                            text: 'Restaurant / Diner'
                        }
                    ],
                    rowCount: 1
                }
            ]
        },
        {
            name: 'page3',
            elements: [
                {
                    type: 'radiogroup',
                    name: 'transport',
                    title: 'What was your main means of transport?',
                    isRequired: true,
                    choices: [
                        {
                            value: 'car',
                            text: 'Car'
                        },
                        {
                            value: 'bus',
                            text: 'Bus'
                        },
                        {
                            value: 'train',
                            text: 'Train / Metro'
                        },
                        {
                            value: 'bike',
                            text: 'Bike'
                        },
                        {
                            value: 'skateboard',
                            text: 'Skateboard'
                        },
                        {
                            value: 'walk',
                            text: 'Walking'
                        }
                    ]
                }
            ]
        },
        {
            name: 'page4',
            elements: [
                {
                    type: 'rating',
                    name: 'busy',
                    title: 'How busy was your day?',
                    isRequired: true,
                    rateMax: 10,
                    minRateDescription: 'Not busy at all',
                    maxRateDescription: 'Really busy'
                }
            ]
        },
        {
            name: 'page5',
            elements: [
                {
                    type: 'radiogroup',
                    name: 'dinner',
                    title: 'How did you get your dinner?',
                    choices: [
                        {
                            value: 'cook',
                            text: 'I cooked it myself'
                        },
                        {
                            value: 'warmup',
                            text: 'I warmed something up'
                        },
                        {
                            value: 'order',
                            text: 'I ordered it'
                        }
                    ]
                }
            ]
        },
        {
            name: 'page6',
            elements: [
                {
                    type: 'text',
                    name: 'age',
                    title: 'How old are you?',
                    isRequired: true,
                    validators: [
                        {
                            type: 'numeric',
                            text: 'Choose a valid age!',
                            minValue: 0,
                            maxValue: 120
                        }
                    ],
                    inputType: 'number'
                }
            ]
        },
        {
            name: 'page7',
            elements: [
                {
                    type: 'rating',
                    name: 'sickness',
                    title: 'Have you been sick today?',
                    rateMin: 0,
                    rateMax: 4,
                    minRateDescription: 'Not at all',
                    maxRateDescription: 'Very sick'
                }
            ]
        },
        {
            name: 'page8',
            elements: [
                {
                    type: 'rating',
                    name: 'drink',
                    title: 'How much did you drink during the day?',
                    rateMin: 0,
                    rateMax: 4,
                    minRateDescription: 'Very less',
                    maxRateDescription: 'Very much'
                }
            ]
        }
    ],
    showPageNumbers: true,
    showProgressBar: 'bottom',
    requiredText: '',
    firstPageIsStarted: true
};
