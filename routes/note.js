const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require('../model/Note')
const router = express.Router();


// ROUTE 1 : Fetching users notes : /api/note/fetchnotes : Login req
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
})
// Route 2 : Adding notes of a loggedin user : api/note/addnotes : Login req
router.post('/addnotes', fetchuser, [body('title', 'blank title not allowed').isLength({ min: 3 }), body('description', 'blank desc is not allowed').isLength({ min: 5 })], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            return res.status(400).json({ errors: errs.array() });
        }
        // creating notes
        const note = new Note({
            user: req.user.id,
            title: title,
            description: description,
            tag: tag
        });
        const savedNote = await note.save();
        res.json(savedNote);
    }
    catch (error) {
        console.error(error.message, "Something went wrong");
    }
})
//Route 3 : Updating a users notes when logged in : /api/note/updatenotes/:id : Login req
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Note.findById(req.params.id);
        if (!note) { res.status(404).send('Note not found') }
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Unauthorised action");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message, "Something went wrong");
    }
})
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note){return res.status(404).send("Note not found")}
        if (note.user.toString() !== req.user.id){
            return res.status(401).send("Unauthorised Action");
        }
        note = await Note.deleteOne({_id : req.params.id});
        res.json({"success":"Your note has been deleted"})
    }
    catch (error) {
        console.error(error.message, "Something went wrong");
    }
})
module.exports = router