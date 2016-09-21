# medium-waffle

Medium-waffle was the working title for what was later called Uutiskylpy (news bath in Finnish), a language learning app for recent immigrants
That uses the simplified news broadcast by YLE (Finland's public broadcaster). Users can watch small news fragments, each of which is
transcribed with Finnish text. By tapping words of the transcription that are visible while the user is watching, they are able to see a
translation of that word, including information on grammar (conjugations, pre- and suffixes, etc.). When the user is really struggling,
they can also choose to get a full translation of the sentence, in which words are color coded to show which Finnish word corresponds with
words in their native language.

This project was part of the Design Project course at Aalto University. The course focused on user centered product and service design.

# Technical overview

This is a rather basic prototype, meant purely as a proof of concept and to get validation with our user group. S
 - Uses cordova to make sure it easily runs on mobile devices and can be distributed easily
 - Uses Plain html5, css3 and jQuery for everything on the front end. 
 - Has a very basic back end that simply consists of XML files that contain translations for seperate words, including information
 on grammar to further help users learn the language.
