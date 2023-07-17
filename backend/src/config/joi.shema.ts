import * as Joi from 'joi';

export const configSchema = Joi.object({
  port: Joi.number().integer().default(3000),
  database: Joi.object({
    host: Joi.string().hostname().required(),
    port: Joi.number().integer(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
  }),
  secretKey: Joi.string(),
});
