import * as Samples from './sample-mappings'

export function generateSequence(noteToURL: Samples.SamplesObject, numNotes: number, probability: number): Array<string> {
    const sequence: string[] = [];

    if (noteToURL == null) {
        throw new Error('Tried to generate sequence with empty sampler. ');
    }
    const notes = Object.keys(noteToURL);

    let iNote: number;
    for (let i = 0; i < numNotes; i++) {
        if (Math.random() <= probability) {
            iNote = Math.floor(Math.random() * notes.length);
            sequence.push( notes[iNote] );
        } else {
            sequence.push(null);
        }
    }

    return sequence;
}