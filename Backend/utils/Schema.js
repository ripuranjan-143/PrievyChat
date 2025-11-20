import Joi from 'joi';

const nameField = Joi.string().min(4).max(25).trim().messages({
  'string.min': 'Name must be at least 4 characters long',
  'string.max': 'Name cannot exceed 25 characters',
});

const emailField = Joi.string().email().trim().messages({
  'string.email': 'Please provide a valid email address',
});

const passwordField = Joi.string().min(4).trim().messages({
  'string.min': 'Password must be at least 4 characters long',
});

const idField = Joi.string().length(24).hex().required().messages({
  'string.length': 'User ID must be 24 characters long',
  'string.hex': 'User ID must be a valid hexadecimal',
  'any.required': 'User ID is required',
});

// signup schema
const signupSchema = Joi.object({
  body: Joi.object({
    name: nameField.required(),
    email: emailField.required(),
    password: passwordField.required(),
  }).required(),
});

// login schema
const loginSchema = Joi.object({
  body: Joi.object({
    email: emailField.required(),
    password: passwordField.required(),
  }).required(),
});

// get user by ID schema
const getUserByIdSchema = Joi.object({
  params: Joi.object({
    id: idField,
  }).required(),
});

// delete user by ID schema
const deleteUserByIdSchema = Joi.object({
  params: Joi.object({
    id: idField,
  }).required(),
});

// create/access chat schema
const oneToOneChatSchema = Joi.object({
  body: Joi.object({
    userId: idField.required(),
  }).required(),
});

//  create group chat schema
const createGroupChatSchema = Joi.object({
  body: Joi.object({
    name: nameField.required().messages({
      'string.empty': 'Group name is required',
    }),
    users: Joi.array()
      .items(idField)
      .min(2) // minimum 2 users from frontend
      .unique()
      .required()
      .messages({
        'array.min':
          'At least 2 users are required to create a group chat',
        'array.base': 'Users must be an array of user IDs',
      }),
  }).required(),
});

// rename group chat schema
const updateGroupChatSchema = Joi.object({
  body: Joi.object({
    chatId: idField.required().messages({
      'any.required': 'chatId is required',
    }),

    chatName: nameField.required().messages({
      'string.empty': 'chatName cannot be empty',
      'any.required': 'chatName is required',
    }),
  }).required(),
});

// add a user to a group
const addUserToGroupSchema = Joi.object({
  body: Joi.object({
    chatId: idField.required(),
    userId: idField.required(),
  }).required(),
});

// remove a user from a group
const removeUserFromGroupSchema = Joi.object({
  body: Joi.object({
    chatId: idField.required(),
    userId: idField.required(),
  }).required(),
});

// allMessages schema (get messages by chatId)
const getChatMessagesSchema = Joi.object({
  params: Joi.object({
    chatId: idField.messages({
      'any.required': 'chatId is required',
    }),
  }).required(),
});

export {
  signupSchema,
  loginSchema,
  getUserByIdSchema,
  deleteUserByIdSchema,
  oneToOneChatSchema,
  createGroupChatSchema,
  updateGroupChatSchema,
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  getChatMessagesSchema,
};
