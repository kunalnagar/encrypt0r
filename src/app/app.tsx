import React from 'react';

const App = () => {
  return (
    <>
      <section className="text-center">
        <h3>encrypt0r</h3>
        <p>A simple way to encrypt and decrypt your files</p>
      </section>
      <section id="area_choices">
        <p>What would you like to do?</p>
        <ol>
          <li>
            <a href="#" id="choice_encrypt" className="btn--choice">
              Encrypt
            </a>
          </li>
          <li>
            <a href="#" id="choice_decrypt" className="btn--choice">
              Decrypt
            </a>
          </li>
        </ol>
      </section>
      <br />
      <div className="d--flex items--center m-r-1">
        <input
          type="password"
          id="passphrase"
          className="d--none w-100"
          name=""
          placeholder="Enter passphrase"
        />
        <a href="#" id="btn_encrypt" className="d--none m-r-1">
          Encrypt
        </a>
        <a href="#" id="btn_decrypt" className="d--none m-r-1">
          Decrypt
        </a>
        <a href="#" id="choice_reset" className="d--none">
          Reset
        </a>
      </div>
      <div id="area_drag" className="text-center d--none">
        <h4>Drag file here</h4>
        <p id="file_path"></p>
        <p className="notice"></p>
      </div>
    </>
  );
};

export default App;
