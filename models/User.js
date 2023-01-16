const { Schema, model } = require('mongoose');

const UserSchema = new Schema (
    {
        username: { type: String, required: true, unique: true, trim: true, },
        email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,'Please Enter A Valid Email!'],},
        thought: [{ type: Schema.Types.ObjectId, ref: 'Thought',},],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User',},],
    },
    {
        toJSON: { virtuals: true, getters: true },
        id: false,
    }
);

UserSchema.virtual('friendCount').get(function() { return this.friends.length; })

const User = model('User', UserSchema);

module.exports = User;