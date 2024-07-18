import { writable } from 'svelte/store';

export const browseActive = writable(true);

export function toggleCard() {
    browseActive.update(value => !value);
}