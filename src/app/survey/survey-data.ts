export const surveyJSON =
{
    pages: [
     {
      name: "page1",
      elements: [
       {
        type: "radiogroup",
        name: "question1",
        title: "Where do you live?",
        isRequired: true,
        choices: [
         {
          value: "item1",
          text: "City"
         },
         {
          value: "item2",
          text: "Village"
         }
        ]
       }
      ]
     },
     {
      name: "page2",
      elements: [
       {
        type: "matrixdynamic",
        name: "question2",
        title: "On which of these spots did your day take place?",
        isRequired: true,
        columns: [
         {
          name: "Column 1"
         }
        ],
        choices: [
         {
          value: 1,
          text: "Home"
         },
         {
          value: 2,
          text: "Work"
         },
         {
          value: 3,
          text: "Outdoors"
         },
         {
          value: 4,
          text: "Supermarket"
         },
         {
          value: 5,
          text: "Shopping Mall"
         },
         {
          value: "6",
          text: "Restaurant / Diner"
         }
        ],
        rowCount: 1
       }
      ]
     },
     {
      name: "page3",
      elements: [
       {
        type: "checkbox",
        name: "question3",
        title: "What were your main means of transport?",
        isRequired: true,
        choices: [
         {
          value: "item1",
          text: "Car"
         },
         {
          value: "item2",
          text: "Bus"
         },
         {
          value: "item3",
          text: "Train / Metro"
         },
         {
          value: "item4",
          text: "Bike"
         },
         {
          value: "item5",
          text: "Skateboard"
         },
         {
          value: "item6",
          text: "Walking"
         }
        ]
       }
      ]
     },
     {
      name: "page4",
      elements: [
       {
        type: "rating",
        name: "question4",
        title: "How busy was your day?",
        isRequired: true,
        rateMax: 10,
        minRateDescription: "Not busy at all",
        maxRateDescription: "Really busy"
       }
      ]
     },
     {
      name: "page5",
      elements: [
       {
        type: "radiogroup",
        name: "question6",
        title: "How did you get your dinner?",
        choices: [
         {
          value: "item1",
          text: "I cooked it myself"
         },
         {
          value: "item2",
          text: "I warmed something up"
         },
         {
          value: "item3",
          text: "I ordered it"
         }
        ]
       }
      ]
     },
     {
      name: "page6",
      elements: [
       {
        type: "text",
        name: "question5",
        title: "How old are you?",
        isRequired: true,
        validators: [
         {
          type: "numeric",
          text: "Choose a valid age!",
          minValue: 0,
          maxValue: 120
         }
        ],
        inputType: "number"
       }
      ]
     },
     {
      name: "page7",
      elements: [
       {
        type: "rating",
        name: "question7",
        title: "Have you been sick today?",
        rateMin: 0,
        rateMax: 4,
        minRateDescription: "Not at all",
        maxRateDescription: "Very sick"
       }
      ]
     },
     {
      name: "page8",
      elements: [
       {
        type: "rating",
        name: "question8",
        title: "How much did you drink during the day?",
        rateMin: 0,
        rateMax: 4,
        minRateDescription: "Very less",
        maxRateDescription: "Very much"
       }
      ]
     }
    ],
    showPageNumbers: true,
    showProgressBar: "bottom",
    requiredText: "",
    firstPageIsStarted: true
   };
