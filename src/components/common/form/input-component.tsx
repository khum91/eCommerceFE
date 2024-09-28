import { Controller, useController } from "react-hook-form"
import { INPUT_TYPE, ITextInputComponent, ISelectProps, IFileInputComponent, dSelectProps } from "./input-contract"
import Select from 'react-select'
import { FaPaperPlane, FaUndo } from "react-icons/fa"
import { useState } from "react"

export const TextInputComponent = ({ type = INPUT_TYPE.TEXT, defaultValue = '', name, control, msg, disable=false }: ITextInputComponent) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue,
        rules: {
            required: true
        }
    })
    return (<>
        <input
            type={type}
            id={name}
            {...field}
            disabled={disable}
            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
        />
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}
export const TextInputCapital = ({ type = INPUT_TYPE.TEXT, defaultValue = '', name, control, msg }: ITextInputComponent) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue,
        rules: {
            required: true
        }
    })
    return (<>
        <input
            type={type}
            id={name}
            {...field}
            className="capitalize mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
        />
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}

export const TextAreaInputComponent = ({ defaultValue = '', name, control, msg }: ITextInputComponent) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue
    })
    return (<>
        <textarea
            id={name}
            rows={3}
            {...field}
            className="resize-none mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm">
        </textarea>
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}
export const NumberInputComponent = ({ name, control, msg }: ITextInputComponent) => {
    const { field } = useController({
        control: control,
        name: name,
        rules: {
            required: true
        }
    })
    return (<>
        <input
            type="number"
            id={name}
            {...field}
            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
        />
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}

export const RoleSelector = ({ defaultValue = '', name, control, msg }: ITextInputComponent) => {
    return (<>
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field: { onChange } }) => (
                <select
                    id={name}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                >
                    <option value='customer'>Buyer</option>
                    <option value='seller'>Seller</option>
                </select>
            )}
        />
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}

export const SelectComponent = ({ options, name, control, msg, multiple = false, defaultValue }: ISelectProps) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue,
    })
    return (<>
        <Select options={options}{...field} isMulti={multiple} isClearable className="w-full" />
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}

export const DropdownComponent = ({ label, options, name, control, msg, defaultValue, disabled = false }: dSelectProps) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue,
        disabled: disabled
    })
    return (<>
        <select
            {...field}
            className="w-full rounded-md border p-2 bg-white text-black text-sm"
            aria-describedby="parent-error">
            <option value="">
                {label}
            </option >
            {options && options.map((p: any) => (
                <option key={p.value} value={p.value} >
                    {p.label}
                </option>
            ))}
        </select>
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}
export const SingleImageUpload = ({ name, setValue, msg, imageUrl = null }: IFileInputComponent) => {
    const [thumb, setThumb] = useState();
    return (<>
        <div className='inline-flex items-start gap-5 w-full'>
            <input className="block w-1/2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help"
                id={name}
                type="file"
                name={name}
                accept="image/*"
                onChange={(e: any) => {
                    e.preventDefault();
                    const name = e.target.name;
                    const image = e.target.files[0];
                    setValue(name, image);
                    setThumb(image)
                }}
            />
            <img className="w-1/4" src={thumb && typeof thumb === 'object' ? URL.createObjectURL(thumb) : (imageUrl && typeof imageUrl === 'string' ? imageUrl : 'https://placehold.co/150x100?text=Image not found')} alt="image" />
        </div>
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}


export const ImageUpload = ({ name, setValue, msg, imageUrl = null }: IFileInputComponent) => {
    const [thumb, setThumb] = useState();
    return (<>
        <div >
            <img className='max-h-80 mb-5' src={thumb && typeof thumb === 'object' ? URL.createObjectURL(thumb) : (imageUrl && typeof imageUrl === 'string' ? imageUrl : 'https://placehold.co/400x400?text=Image not found')} alt="image" />
            <input className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help"
                id={name}
                type="file"
                name={name}
                accept="image/*"
                onChange={(e: any) => {
                    e.preventDefault();
                    const name = e.target.name;
                    const image = e.target.files[0];
                    setValue(name, image);
                    setThumb(image)
                }}
            />
        </div>
        <span className="text-sm italic text-red-700">{msg}</span>
    </>)
}

export const SubmitButton = ({ btnText, loading = false }: { btnText: string, loading: boolean }) => {
    return (<>
        <button type="submit"
            disabled={loading}
            className="inline-flex disabled:cursor-not-allowed disabled:bg-teal-100 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-teal-700 rounded-lg focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-900 hover:bg-teal-800">
            <FaPaperPlane className="me-2" /> {btnText}
        </button>
    </>)
}

export const CancelButton = ({ btnText, loading = false }: { btnText: string, loading: boolean }) => {
    return (<>
        <button type="reset"
            disabled={loading}
            className="inline-flex disabled:cursor-not-allowed disabled:bg-red-100 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800">
            <FaUndo className="me-2" /> {btnText}
        </button>
    </>)
}
