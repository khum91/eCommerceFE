import { BaseSyntheticEvent } from 'react';
export enum INPUT_TYPE {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email',
    PASSWORD = 'password',
    TEL = 'tel',
    URL = 'url'
}
export type handleChangeType = (e: BaseSyntheticEvent) => {};
export interface ITextInputComponent {
    type?: INPUT_TYPE,
    name: string,
    control: any,
    defaultValue?: string,
    msg?: string | undefined | null
    disable?:boolean
}

export interface IFileInputComponent {
    name: string,
    setValue: any,
    msg?: string | undefined | null
    imageUrl?: string | undefined | null
}

export interface SelectOption {
    label: string,
    value: string
}

export interface ISelectProps {
    options: any,
    name: string,
    control: any,
    msg?: string | undefined | null,
    defaultValue?: string,
    multiple?: boolean
}

export interface dSelectProps {
    label: string,
    options: any,
    name: string,
    control: any,
    msg?: string | undefined | null,
    defaultValue?: string,
    disabled?: boolean | false
}
