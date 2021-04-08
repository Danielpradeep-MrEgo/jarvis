import React, {useState} from 'react'
import "./EmojiSetter.css"
import { Picker } from 'emoji-mart'


function EmojiSetter() {
    const [input, setInput] = useState({});


    const handleChange = e => {
        setInput({ text: e.target.value })
    };

    const text = " "
    const addEmoji = e => {
        let emoji = e.native;
        setInput({
          text: input.text + emoji
        });
    };
    console.log("tytped", input)

    const handleSubmit = e => {
        e.preventDefault()
        postMessage(setInput())   //send to backend
        setInput({ text: '' })  //reset input field to empty
    }

    console.log("final", text)
  

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={input.text}
                    onChange={handleChange}
                    placeholder="Type a message"
                />
            </form>

            <span>
                <Picker onSelect={addEmoji} />
            </span>
            </div>
    )
}

export default EmojiSetter
