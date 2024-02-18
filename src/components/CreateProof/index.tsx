import * as snarkjs from 'snarkjs';
import { useState } from 'react'

export default function CreateProof(props: {
    setPublicSignals: (arg0: snarkjs.PublicSignals) => void | undefined,
    setProof: (args0: snarkjs.Groth16Proof) => void | undefined,
    proof: snarkjs.Groth16Proof | undefined
    publicSignals: snarkjs.PublicSignals | undefined
}) {
    const { setPublicSignals, setProof, proof, publicSignals } = props;
    const [witnesses, setWitnesses] = useState<number[]>([1, 2, 3, 4, 5]);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleClick = () => {
        const inputFieldElement = document.getElementById("witness") as HTMLInputElement;
        setWitnesses([...witnesses, Number(inputFieldElement.value)]);
    };

    async function calculateProof(witnesses: number[], setPublicSignals: (arg0: snarkjs.PublicSignals) => void, setProof: (arg0: snarkjs.Groth16Proof) => void) {
        setError(undefined);

        if (witnesses.length !== 5) {
            setError("Set exactly 5 numbers in the witness array. The circuit generates a zk-proof of correctly computing the average of 5 numbers.")
            return
        }
        const { proof, publicSignals } =
            await snarkjs.groth16.fullProve({
                in: witnesses
            }, "./average.wasm", "./average.zkey");

        setPublicSignals(publicSignals)
        setProof(proof)

        // Add this to verify the proof in browser.
        //
        // const vkey = await fetch("average.vkey.json").then(function (res) {
        //     return res.json();
        // });
        //  const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
    }
    return (
        <>
            <div className="flex flex-col box">
                <div className="border border-solid border-black-500">
                    <input type="text" id="witness" name="witness" />
                </div>
                <br />
                <button className="btn btn-blue" onClick={handleClick}>
                    Add Number To Witness
                </button>
                <br />
                <button className="btn btn-blue" onClick={() => setWitnesses([])}>
                    Clear Witnesses
                </button>
                {
                    witnesses && (
                        <>
                            <br />
                            <div className="result-box">
                                <div>
                                    Witnesses:
                                </div>
                                <br />
                                {JSON.stringify(witnesses)}
                            </div>
                        </>
                    )
                }
            </div>
            <br />
            <button className="btn btn-blue" onClick={() => calculateProof(witnesses, setPublicSignals, setProof)}>Calculate Proof</button>
            {error && (
                <>
                    <br />
                    <div role="alert" className="error-box">
                        Error: {error}
                    </div>
                </>
            )
            }
            {
                proof && (
                    <>
                        <br />
                        <div className="result-box">
                            <div>
                                Proof:
                            </div>
                            <br />
                            {JSON.stringify(proof)}
                        </div>
                    </>
                )
            }
            {
                publicSignals && (
                    <>
                        <br />
                        <div className="result-box">
                            <div>
                                Public Signals (average of the witness values):
                            </div>
                            {publicSignals}
                            <br />

                        </div>
                        <div>
                            Note: The average is calculated over a finite field (calculation is done modulo a prime number p).
                        </div>
                    </>
                )
            }
        </>
    )
}
