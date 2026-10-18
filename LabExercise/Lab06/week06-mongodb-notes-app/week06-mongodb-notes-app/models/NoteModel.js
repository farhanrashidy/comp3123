const mongoose = require('mongoose');

//TODO - Create Note Schema here having fields
//      - noteTitle
//      - noteDescription
//      - priority (Value can be HIGH, LOW or MEDUIM)
//      - dateAdded
//      - dateUpdated

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const formatDate = (d = new Date()) =>
    `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
 
const NoteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: [true, 'noteTitle is required'],
        trim: true
    },
    noteDescription: {
        type: String,
        required: [true, 'noteDescription is required'],
        trim: true
    },
    priority: {
        type: String,
        uppercase: true,
        enum: {
            values: ['LOW', 'MEDIUM', 'HIGH'],
            message: 'priority must be LOW, MEDIUM or HIGH'
        },
        default: 'MEDIUM'
    },
    dateAdded: {
        type: String,
        default: () => formatDate()
    },
    dateUpdated: {
        type: String,
        default: () => formatDate()
    }
});
 
module.exports = mongoose.model('Note', NoteSchema);
module.exports.formatDate = formatDate;