---
layout: post
title: Sufjan Stevens Lyrics Generator using a LSTM model
date: 2018-07-16
tags: [Post]
categories: Data
intro: "Data Science + Sufjan Stevens = ?"
---

If I had to name my favorite musician in the entire world, I would probably say it is Sufjan Stevens. He is an Oscar-nominated, indie/folk/electronic/alternative, multiinstrumentalist and musician. He also has a singing voice that is so soft and angelic, you can't help but feel you've transcended this sphere you inhabit (or maybe that's just me). At the core of it all, however, what attracts me to Sufjan's music the most is he is fundamentally a storyteller through song. He has written two albums after states in the US (Illinois and Michigan), an album in the perspective of the planets in the universe, an album about the loss of his mother (and an ode to Oregon), among many other albums. For this reason, I thought it would be interesting to attempt to create a model that could generate lyrics of the artistic, story-telling caliber of Sufjan Stevens.

<p align="center">
 <img src="https://i.imgur.com/KlhtxfB.gif" alt="Sufjan saying Fantastic!" width="80%">
</p>

<h4>Deciding upon the LSTM model</h4>
For the purposes of creating this lyric generator, I decided to use a Long Short Term Memory (LSTM) model. I will briefly go over what an LSTM model is and why I selected it, but if you are interested in a thorough explanation of LSTM model's I highly recommend 
<a href="http://colah.github.io/posts/2015-08-Understanding-LSTMs/">Understanding LSTMs by Cristopher Olah</a>

Briefly, an LSTM is a type of recurrent neural network that resolves the vanishing gradient problem that recurrent neural networks tend to exhibit. Recurrent neural networks (RNN) are chain-like networks with loops, in contrast to a feed-forward neural network where information only travels one direction. These loops provide a chain-like structure that allows past information to persist in the model. This makes RNNs a good choice for our lyric generator, as the chain-like structure lends itself well to sequences. Theoretically, RNNs are capable of remembering early input information when generating an output later in the network, however in practice they exhibit difficulty learning long-range dependencies. In the optimization process of minimizing the loss function in RNNs, gradients are calculated using the backpropagation algorithm, which uses the chain rule to compute the gradient of the loss (error) with respect to the weights. The issue arises when certain activation functions are used. One such activation function is the sigmoid function because the sigmoid function's derivative is always less than 0.25, resulting in the potential for a lot of small numbers being multiplied together, ultimately resulting in a really small gradient value (and little to no adjustments to the model weights). 

LSTMs avoid the long-term dependency problem by addressing the vanishing gradient issue with a memory unit called the cell. This cell makes a decision by considering previous information at each time step including the previous output, previous cell state, as well as the current input. With each time step, the memory is altered and a new output is generated. The LSTM has the ability to remove/add information to the cell state with structures called gates, which optionally let information through.

<h4>Gathering the data</h4>
I used two APIs, <a href="https://github.com/enricobacis/lyricwikia">lyricwikia</a> to get the lyrics, and <a href="https://github.com/plamere/spotipy">spotipy</a>, to get the top 50 songs by Sufjan. 

```python
# to use the spotipy API you will need to create an acct and get an API key
client_credentials_manager = SpotifyClientCredentials(client_id='ENTER_CLIENT_ID_HERE')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# you can add more artists in the array to pass through the loop
artists = ['Sufjan Stevens']

top_50 = {}
for artist in artists:
    top_50[artist] = []
    results = sp.search(q=artist, limit=50)
    for i, t in enumerate(results['tracks']['items']):
        print(str(i) + '. ' + t['name'])
        top_50[artist].append(t['name'])
```

<h4>Exploratory data analysis</h4>
After reading in the available lyrics (31 out of 50 song lyrics were available through the API), I mapped the unique words with their frequencies in each song to get an idea of the vocabulary range in his music. I wrote a few functions to complete this task, which I have included the code for below.

```python
def make_upper(words):
    return map(lambda word : word.upper(), words)

def word_cnt(words):
    wordfreq = []
    map(lambda word : word.upper(), words)
    wordlist = words.split()
    wordfreq = [wordlist.count(w) for w in wordlist]
    return dict(zip(wordlist,wordfreq))

def get_freqs(lyrics):
    freqs = word_cnt(lyrics)
    return freqs



def get_lyrics(top_50):
    unique_words = []
    titles = []
    dictionaries = []
    title_lyrics = {}
    all_lyrics = []
    plot_data = []

    for artist in top_50.keys():
        print(artist)
        songs = top_50[artist]
        for title in songs:
            print(title)
            title = title.lstrip(' ')
            try:
                lyrics = lyricwikia.get_lyrics(artist, title)
                all_lyrics.append((lyrics))
                freq_vals = get_freqs(lyrics)
                if len(freq_vals)>0:
                    print('unique word count: ' + str(len(freq_vals)))
                    title_lyrics[title] = lyrics
                    xaxis = np.linspace(1, len(freq_vals), len(freq_vals))
                    trace = go.Scatter(
                      x = xaxis,
                      y = [v for v in freq_vals.values()], 
                      name=title
                    )
                    plot_data.append(trace)
                    plt.plot(xaxis, [v for v in freq_vals.values()])
                    plt.title(title)
                    plt.xlabel('unique word')
                    plt.ylabel('frequency')
                    plt.show()
                    dictionaries.append(freq_vals)
                    unique_words.append(len(freq_vals))    
                    titles.append(title)
                    df_data = pd.DataFrame({'Artist':artist,
                                            'Song': titles,
                                            'Unique Word Count': unique_words,
                                            'Dictionary of word count': dictionaries
                    })
            except:
                continue
    return all_lyrics, df_data
```
To get the data for training our model, I call ```all_lyrics, df_data = get_lyrics(top_50)```. 
I visualized the data as line graphs where the x-axis are unique words (indicated by a numeric value) and the y-axis are the corresponding frequencies in the song. Some songs are more repetitive than others, so they have fewer unique words. On average, however, Sufjan's songs have around 98 unique words. Below are samples of the unique word mapping for the songs Casimir Pulaski Day and Chicago.

<b>Song title:</b> Casimir Pulaski Day
<b>Unique word count:</b> 153

<p align="center">
<img src="https://i.imgur.com/zQQ4Cye.png" alt="Chicago Unique Word Count Graph" width="80%">
</p>
<b>Song title:</b> Chicago
<b>Unique word count:</b> 66
<p align="center">
<img src="https://i.imgur.com/St7jbu3.png" alt="Casimir Pulaski Day Unique Word Count Graph" width="80%">
</p>
<h4>Cleaning/Preparing the data for training</h4>
To prepare the data, I read all of the data into  a string and make the characters lowercase in order to reduce the number of features. Next, I created a dictionary with the KEY as a unique number and VALUE as the unique character in the set. I use this dictionary later in the process to properly the encode the data to be understood by our keras model. 


```python
# put all lyrics into one long string to get count of total characters
data = ""
for lyric in all_lyrics:
    data = data + " " +  lyric.lower()
    
# get list of unique characters
chars = sorted(list(set(str(data))))
# chars = [char for char in chars]

# create dictionary of key: numeric, val: unique character
char_to_int = dict((c, i) for i, c in enumerate(chars))

# create dictionary of key: unique character, val: numeric
int_to_char = dict((i, c) for i, c in enumerate(chars))

# get count of total characters
N_ALL_CHARS = len(data)

# get count of unique characters
N_UNIQUE_CHARS = len(chars)

print("Total Characters: " + str(N_ALL_CHARS))
print("Total Distinct Characters: " + str(N_UNIQUE_CHARS))
print("Unique Characters: ", chars)
```

The resulting dataset included 36,198 characters total, with 42 unique characters including punctuation marks, numbers, and letters. 

The next step in the preparation required that I convert the sequence data into a 3D vector defined by (number_of_sequences, sequence_length, num_unique_chars) in order to be able to pass it to the model. I created placeholder vectors filled with zeros for the input and output vectors using `np.zeros()`. 

For the vector shape:
- I arbitrarily set the sequence length to be 50. 
- Next, I calculated the value for the number of sequences simply by dividing the total number of characters in my dataset by the sequence length. 
- Lastly, I got the number of unique characters from my dataset from getting the `len(set())` of my data. 

For my dataset, the input and output shapes are (723, 50, 42). 

```python
# prepare the dataset of input-output pairs encoded as integers
# set char length of lyric line
SEQ_LENGTH = 50 
N_SEQ = int(len(data)/SEQ_LENGTH)

# create list of keys for each character window
# inputs data needs to be 3D  (number of sequences, length of sequences, number of features aka unique chars)
inputs = np.zeros((N_SEQ, SEQ_LENGTH, N_UNIQUE_CHARS)) # key of each character in window

# create list of output result from input key window
outputs = np.zeros((N_SEQ, SEQ_LENGTH, N_UNIQUE_CHARS))
```
To fill the placeholder vectors, I iterated through the dataset by the defined window to get the current sequence. Then, I iterated through the obtained sequence to get the numeric-encoding of each character. 

For example, the first input sequence window, at `i = 0`, (from 0 to 50) is a character array that looks like this:
```python
[' ', 't', 'h', 'e', ' ', 'o', 'n', 'l', 'y', ' ', 't', 'h', 'i', 'n', 'g', ' ', 't', 'h', 'a', 't', ' ', 'k', 'e', 'e', 'p', 's', ' ', 'm', 'e', ' ', 'f', 'r', 'o', 'm', ' ', 'd', 'r', 'i', 'v', 'i', 'n', 'g', ' ', 't', 'h', 'i', 's', ' ', 'c', 'a']
```
The corresponding numeric representation looks like this: 
```python
[1, 34, 22, 19, 1, 29, 28, 26, 39, 1, 34, 22, 23, 28, 21, 1, 34, 22, 15, 34, 1, 25, 19, 19, 30, 33, 1, 27, 19, 1, 20, 32, 29, 27, 1, 18, 32, 23, 36, 23, 28, 21, 1, 34, 22, 23, 33, 1, 17, 15]
```
In order to get the first character value, the empty space ' ', to be represented in our 3D vector, I used a one-hot encoding representation of the value. The one-hot encoding looks like a sparse vector filled with 0's and a 1 value placed at an index we defined in our dictionary mapping of characters to integers. 

For example, in the first iteration through the sequence, at `j = 0`, the numeric representation of our value is 1. The one-hot encoding for our character looks like:
`[0, 1, 0, 0, 0, ..., n=47],`


```python
# iterate through all characters, shifting window by 1 character
for i in range(0, N_SEQ):
    input_seq = data[i:i+SEQ_LENGTH]
    # get numeric encodings of character values for window
    input_seq_idx = [char_to_int[value] for value in input_seq]
    # create input sequence placeholder to one-hot encode unique_character 
    input_seq_ph = np.zeros((SEQ_LENGTH, N_UNIQUE_CHARS))
    # iterate through placeholder to one-hot encode, placing 1 value 
    # at mapped position to indicate the unique character
    for j in range(SEQ_LENGTH):
        input_seq_ph[j][input_seq_idx[j]] = 1.
    inputs[i] = input_seq_ph

    output_seq = data[i+1:(i+1)+SEQ_LENGTH]
    output_seq_idx = [char_to_int[value] for value in output_seq]
    output_seq_ph = np.zeros((SEQ_LENGTH, N_UNIQUE_CHARS))
    for j in range(SEQ_LENGTH):
        output_seq_ph[j][output_seq_idx[j]] = 1.           
    outputs[i] = output_seq_ph
    
# get total number of patterns
N_PATTERNS = len(inputs)
print("Total Patterns: " + str(N_PATTERNS))

```

Here is an example of what the input and output  sequences may look like before encoding the sequences to integers:

**SEQ_IN:** warm bath, holiday inn after dark
signs and wonder

**SEQ_OUT:** arm bath, holiday inn after dark
signs and wonders

<h4>Building/Training LSTM Model:</h4>
To build the model, I used Keras (a wrapper for tensorflow). Below is the code for my model with comments explaining the layers and parameters:

```python 
model = Sequential()
# 256 memory units in cell
# Our input shape indicates variable-length sequences of 42-dimensional vectors
# return_sequences = True, return hidden state output for each input time step
# the output will be a sequence of the same length, as opposed to just one vector
model.add(LSTM(256, input_shape=(None, N_UNIQUE_CHARS), return_sequences=True))
model.add(LSTM(256, return_sequences=True))

# Dropout 20% of inputs (to reduce overfitting)
model.add(Dropout(0.2))
# TimeDistributed allows you to apply Dense operation across every output at each time step 
model.add(TimeDistributed(Dense(N_UNIQUE_CHARS, activation='softmax')))
model.compile(loss='categorical_crossentropy', optimizer='adam')
```

I ran 100 epochs with a batch size of 32. 

<h4>Generating Lyrics from Model</h4>

To generate lyrics, I defined a function with a `model` parameter for the trained model and a `lyric_length` parameter. 
```python
def generate_lyrics(model, lyric_length):
    idx = [np.random.randint(N_UNIQUE_CHARS)]
    output_lyrics = [int_to_char[idx[-1]]]
    print(idx[-1])
    print('in: ', output_lyrics, '\n')
    # shape is (number of sequences, length of sequences, number of features aka unique chars)
    start = np.zeros((1, lyric_length, N_UNIQUE_CHARS))
    for i in range(lyric_length):
        start[0, i, :][idx[-1]] = 1
        print(int_to_char[idx[-1]], end="")
        # np.argmax returns position of largest probability value
        prediction = model.predict(start[:, :i+1, :])
        idx = np.argmax(prediction[0], axis=1)
        result = int_to_char[idx[-1]]
        output_lyrics.append(result)
    return ('').join(output_lyrics)
```
In this function, I used a random number generator to get a random value between 0 and 41 (because I had 42 unique characters in this dataset) and prepared the input value to feed into the model (just as I prepared the input for training). Once the input value is fed into the model, I decoded each output back into a non-numeric character, joined each character in the loop together, and generated our Sufjan Stevens' lyrics! 

Running `generate_lyrics(model, 100)`:
```
in:  ['m'] 

me from cutting my arm
crosshatch, warm bath, holiday inn after dark
signs and wonders, water stain writing the wall
daniel's message, blood of the moon on us all

do i care if i despise this?
```
I have to say, that's pretty neat!! 

<h4>Conclusions</h4>
Overall, it was relatively easy to get a create a model that generated understandable words. Running 100 epochs took less than 20 minutes to train. In the future, I'd like to incorporate other artists' works into the dataset in order to increase the number of patterns in the hopes of generating original lyrics. All in all, however, this was a really good learning exercise for understanding how LSTMs work! 

Thanks for reading :) 
