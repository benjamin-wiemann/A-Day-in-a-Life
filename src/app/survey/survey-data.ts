export const surveyJSON =
{
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "checkbox",
     "name": "sleeping_times",
     "title": "When have been your sleeping times today?",
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": "0:00 am"
      },
      {
       "value": "item2",
       "text": "1:00 am"
      },
      {
       "value": "item3",
       "text": "2:00 am"
      },
      {
       "value": "item4",
       "text": "3:00 am"
      },
      {
       "value": "item5",
       "text": "4:00 am"
      },
      {
       "value": "item6",
       "text": "5:00 am"
      },
      "item7",
      "item8",
      "item9",
      "item10",
      "item11",
      "item12",
      "item13",
      "item14",
      "item15",
      "item16",
      "item17",
      "item18",
      "item19",
      "item20",
      "item21",
      "item22",
      "item23"
     ]
    }
   ]
  },
  {
   "name": "page4",
   "elements": [
    {
     "type": "text",
     "name": "locations",
     "title": "On how many different Locations your day took place (max. 10) ?",
     "isRequired": true,
     "validators": [
      {
       "type": "numeric",
       "text": "Select a value between 1 and 10",
       "minValue": 1,
       "maxValue": 10
      }
     ],
     "inputType": "number",
     "size": 2,
     "maxLength": 2,
     "placeHolder": "1"
    }
   ]
  },
  {
   "name": "page5",
   "elements": [
    {
     "type": "rating",
     "name": "What share of your time did you spend outdoors?",
     "isRequired": true,
     "rateValues": [
      {
       "value": "0",
       "text": "0%"
      },
      {
       "value": "1",
       "text": "10%"
      },
      {
       "value": "2",
       "text": "20%"
      },
      {
       "value": "3",
       "text": "30%"
      },
      {
       "value": "4",
       "text": "40%"
      },
      {
       "value": "5",
       "text": "50%"
      },
      {
       "value": "6",
       "text": "60%"
      },
      {
       "value": "7",
       "text": "70%"
      },
      {
       "value": "8",
       "text": "80%"
      },
      {
       "value": "9",
       "text": "90%"
      },
      {
       "value": "10",
       "text": "100%"
      }
     ],
     "rateMax": 10,
     "minRateDescription": "Only indoors ",
     "maxRateDescription": "Only outdoors"
    }
   ]
  },
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
   "name": "page7",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question5",
     "title": "How did you experience your day?",
     "isRequired": true,
     "choices": [
      "item1",
      "item2",
      "item3"
     ]
    }
   ]
  },
  {
   "name": "page8",
   "elements": [
    {
     "type": "rating",
     "name": "question6",
     "title": "How would you rate your day?",
     "isRequired": true,
     "rateMax": 10,
     "minRateDescription": "Really bad",
     "maxRateDescription": "Really good"
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
   "name": "page10",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question1",
     "title": "All in all, are you satisfied with your day?",
     "isRequired": true,
     "choices": [
      {
       "value": "1",
       "text": "Yes"
      },
      {
       "value": "0",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page11",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question7",
     "title": "Did you eat enough throughout the day?",
     "isRequired": true,
     "choices": [
      {
       "value": "1",
       "text": "Yes"
      },
      {
       "value": "0",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page12",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question9",
     "title": "Did you drink enough throughout the day?",
     "isRequired": true,
     "choices": [
      {
       "value": "1",
       "text": "Yes"
      },
      {
       "value": "0",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page13",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question10",
     "title": "Did your day go as planned?",
     "isRequired": true,
     "choices": [
      {
       "value": "1",
       "text": "Yes"
      },
      {
       "value": "0",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page14",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question11",
     "title": "Have you been sick today?",
     "isRequired": true,
     "choices": [
      {
       "value": "1",
       "text": "Yes"
      },
      {
       "value": "0",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page15",
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
  },
  {
   "name": "page16",
   "elements": [
    {
     "type": "checkbox",
     "name": "question14",
     "title": "What were your main means of transport?",
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": "Car"
      },
      {
       "value": "item2",
       "text": "Bus"
      },
      {
       "value": "item3",
       "text": "Train/Metro"
      },
      {
       "value": "item4",
       "text": "Bike"
      },
      {
       "value": "item5",
       "text": "Skateboard"
      }
     ]
    }
   ]
  },
  {
   "name": "page17",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question15",
     "title": "Did you have enough sleep last night?",
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": "Yes"
      },
      {
       "value": "item2",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "page18",
   "elements": [
    {
     "type": "checkbox",
     "name": "question16",
     "title": "What sports did you do today?",
     "choices": [
      {
       "value": "item1",
       "text": "Football"
      },
      {
       "value": "item2",
       "text": "Tennis"
      },
      {
       "value": "item3",
       "text": "Gym"
      }
     ]
    }
   ]
  }
 ],
 "showPageNumbers": true,
 "showProgressBar": "bottom",
 "requiredText": "",
 "firstPageIsStarted": true
};