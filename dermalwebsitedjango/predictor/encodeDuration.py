from sklearn.preprocessing import OrdinalEncoder

def encodeDuration():
    #to run the model, I require a 
    encoder=OrdinalEncoder(categories=[['UNKNOWN',
                                     'ONE_DAY',
                                     'LESS_THAN_ONE_WEEK',
                                     'ONE_TO_FOUR_WEEKS',
                                     'ONE_TO_THREE_MONTHS',
                                     'THREE_TO_TWELVE_MONTHS',
                                     'MORE_THAN_ONE_YEAR',
                                     'MORE_THAN_FIVE_YEARS',
                                     'SINCE_CHILDHOOD'
                                     ]])
