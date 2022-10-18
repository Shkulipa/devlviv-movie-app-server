import { version } from "./../../package.json";

export const API_VERSION = `/api/v${version}`;

export const imgTypes = ["image/png", "image/jpg", "image/jpeg"];

/**
 * Need for create unique id(from help nanoid
 */
 export const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";