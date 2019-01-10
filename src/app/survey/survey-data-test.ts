export const surveyJSON = 
{
 "pages": [  
    {
        "name": "page6",
        "elements": [
            {
            "type": "radiogroup",
            "name": "question4",
            "title": "What is your mood if you think about your day?",
            "isRequired": true,
            "choices": [
            {
            "value": "item1",
            "text": "Happy"
            },
            {
            "value": "item2",
            "text": "Sad"
            },
            {
            "value": "item3",
            "text": "Angry"
            }
            ]
            }
        ]
    },
    {
        "name": "page9",
        "elements": [
         {
          "type": "rating",
          "name": "question8",
          "title": "How busy was your day?",
          "isRequired": true,
          "rateMax": 10,
          "minRateDescription": "Not busy at all",
          "maxRateDescription": "Really busy"
         }
        ]
       },
    {
    "name": "page19",
    "elements": [
        {
        "type": "rating",
        "name": "question12",
        "title": "Have you been on the move a lot?",
        "isRequired": true,
        "rateMax": 10,
        "minRateDescription": "Not at all",
        "maxRateDescription": "Always"
        }
    ]
    }
 ],
 "showPageNumbers": true,
 "showProgressBar": "bottom",
 "requiredText": "",
 "firstPageIsStarted": true
};