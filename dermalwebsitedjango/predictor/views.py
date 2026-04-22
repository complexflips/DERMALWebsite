from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from DERMAL import runDermal
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from sklearn.preprocessing import OrdinalEncoder
import numpy as np
import json
from PIL import Image
import pickle

def encodeDuration(duration):
    #to run the model, I require duration to be encoded
    #I therefore have to do this preprocessing step 
    encoder=OrdinalEncoder(categories=[['Unknown',
        'One Day',
        'Less Than One Week',
        'One to Four Weeks',
        'One to Thee Months',
        'Three to Twelve Months',
        'More Than One Year',
        'More Than Five Years',
        'Since Childhood'
                                     ]])

    return encoder.fit_transform(np.array(duration).reshape(1, -1))

#simple if than lookup table to add a description for each condition
def addDescription(labels):
    finalDict={}
     
    if "Allergic Contact Dermatitis" in labels:
        finalDict["Allergic Contact Dermatitis"]='''From Mayo Clinic: Contact dermatitis is an itchy rash caused by direct contact with a substance or an allergic reaction to it. The rash isn't contagious, but it can be very uncomfortable. Many substances can cause this reaction, such as cosmetics, fragrances, jewelry and plants. The rash often shows up within days of exposure. To treat contact dermatitis successfully, you need to identify and avoid the cause of your reaction. If you avoid the substance causing the reaction, the rash often clears up in 2 to 4 weeks. You can try soothing your skin with a cool, wet cloth and other self-care steps. occurs when a substance to which you're sensitive (allergen) triggers an immune reaction in your skin. It often affects only the area that came into contact with the allergen. But it may be triggered by something that enters your body through foods, flavorings, medicine, or medical or dental procedures (systemic contact dermatitis). People often become sensitized to allergens after many contacts with it over years. Once you develop an allergy to a substance, even a small amount of it can cause a reaction.'''

    if "Insect Bite" in labels:
        finalDict["Insect Bite"]='''From Mayo Clinic: Most insect bites and stings are mild and can be treated at home. They might cause itching, swelling and stinging that go away in a day or two. Some bites or stings can transmit disease-causing bacteria, viruses or parasites. Stings from bees, yellow jackets, wasps, hornets and fire ants might cause a severe allergic reaction (anaphylaxis).'''

    if "Urticaria" in labels:
        finalDict["Urticaria"]='''From Mayo Clinic: Urticaria is characterised by very itchy weals (hives), with or without surrounding erythematous flares. The name urticaria is derived from the common European stinging nettle Urtica dioica. Urticaria can be acute or chronic, spontaneous or inducible. A weal (or wheal) is a superficial skin-coloured or pale skin swelling, usually surrounded by erythema that lasts anything from a few minutes to 24 hours. Urticaria can co-exist with angioedema which is a deeper swelling within the skin or mucous membranes.'''

    if "Folliculitis" in labels:
        finalDict['Folliculitis']='''From Mayo Clinic: "Folliculitis is a common skin condition that happens when hair follicles become inflamed. It's often caused by an infection with bacteria. At first it may look like small pimples around the tiny pockets from where each hair grows (hair follicles). The condition can be itchy, sore and embarrassing. The infection can spread and turn into crusty sores.  Mild folliculitis will likely heal without scarring in a few days with basic self-care. More-serious or repeat infections may need prescription medicine. Left untreated, severe infections can cause permanent hair loss and scarring. Certain types of folliculitis are known as hot tub rash and barber's itch.'''

    if 'Psoriasis' in labels:
        finalDict['Psoriasis']='''From Mayo Clinic: "Psoriasis is a skin disease that causes a rash with itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp. Psoriasis is a common, long-term (chronic) disease with no cure. It can be painful, interfere with sleep and make it hard to concentrate. The condition tends to go through cycles, flaring for a few weeks or months, then subsiding for a while. Common triggers in people with a genetic predisposition to psoriasis include infections, cuts or burns, and certain medications. Treatments are available to help you manage symptoms. And you can try lifestyle habits and coping strategies to help you live better with psoriasis.'''

    if "Tinea" in labels:
        finalDict['Tinea versicolor']='''From Mayo CLinic: Tinea versicolor (TIN-ee-uh vur-si-KUL-ur) is a common skin infection caused by a fungus. The fungus causes patchy changes in skin color. The affected skin may look lighter or darker than the healthy skin. This condition usually forms on the middle of the body and the shoulders. Tinea versicolor is most common in teens and young adults. Sun exposure may make the skin changes more visible because they do not tan. The condition isn't painful or contagious. It's also called pityriasis versicolor. Treatment involves antifungal creams, lotions or shampoos. Skin color may remain uneven for several weeks or months. Tinea versicolor often returns, especially in warm, humid weather.'''

    if "Herpes Zoster" in labels:
        finalDict['Herpes Zoster/Shingles']='''From Mayo Clinic: Shingles is a viral infection that causes a painful rash. Shingles can occur anywhere on your body. It typically looks like a single stripe of blisters that wraps around the left side or the right side of your torso. Shingles is caused by the varicella-zoster virus — the same virus that causes chickenpox. After you've had chickenpox, the virus stays in your body for the rest of your life. Years later, the virus may reactivate as shingles. Shingles isn't life-threatening. But it can be very painful. Vaccines can help lower the risk of shingles. Early treatment may shorten a shingles infection and lessen the chance of complications. The most common complication is postherpetic neuralgia. This is a painful condition that causes shingles pain for a long time after your blisters have cleared.'''

    if "Irritant Contact Dermatitis" in labels:
        finalDict['Irritant Contact Dermatitis']='''From Mayo Clinic: Contact dermatitis is an itchy rash caused by direct contact with a substance or an allergic reaction to it. The rash isn't contagious, but it can be very uncomfortable. Many substances can cause this reaction, such as cosmetics, fragrances, jewelry and plants. The rash often shows up within days of exposure. To treat contact dermatitis successfully, you need to identify and avoid the cause of your reaction. If you avoid the substance causing the reaction, the rash often clears up in 2 to 4 weeks. You can try soothing your skin with a cool, wet cloth and other self-care steps. Irritant contact dermatitis is the most common type. This nonallergic skin reaction occurs when an irritant damages your skin's outer protective layer. Some people react to strong irritants after a single exposure. Others may develop a rash after repeated exposures to even mild irritants, such as soap and water. And some people develop a tolerance to the substance over time.'''

    if "Eczema" in labels:
        finalDict['Atopic dermatitis (eczema)']='''From Mayo Clinic: Atopic dermatitis (eczema) is a condition that causes dry, itchy and inflamed skin. It's common in young children but can occur at any age. Atopic dermatitis is long lasting (chronic) and tends to flare sometimes. It can be irritating but it's not contagious. People with atopic dermatitis are at risk of developing food allergies, hay fever and asthma. Moisturizing regularly and following other skin care habits can relieve itching and prevent new outbreaks (flares). Treatment may also include medicated ointments or creams.'''

    return(finalDict)

def formatOutput(rawOutput):
    formattedOutput=[]
    for i in rawOutput:
        i=np.round(i)
        formattedOutput.append(i)

    encoder=pickle.load(open('multiencoder.pkl','rb'))

    labels=(encoder.inverse_transform(np.array([np.array(formattedOutput)]))[0])

    labelDict=addDescription(labels)

    return (labelDict)


@api_view(('POST','GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def formSubmitted(request):
    if request.method=='POST':
        inputdict=request.data

        image=Image.open(inputdict['image'].file)

        symptoms=list(json.loads(inputdict['symptoms']).values())

        duration=inputdict['duration']

        duration=encodeDuration(duration)

        input=[image,np.concatenate((np.array(symptoms),np.array(duration[0])))]

        rawOutput=runDermal(input)
        print(rawOutput)
        output=formatOutput(rawOutput[0])

        print(output)

        return JsonResponse(output)
    if request.method=='GET':
        return HttpResponse("Incorrect Request Type")