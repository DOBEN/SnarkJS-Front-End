import * as snarkjs from 'snarkjs';

export default function CreateProof(props: {
    setPublicSignals: (arg0: snarkjs.PublicSignals) => void | undefined,
    setProof: (args0: snarkjs.Groth16Proof) => void | undefined,
    proof: snarkjs.Groth16Proof | undefined
    publicSignals: snarkjs.PublicSignals | undefined
}) {
    const { setPublicSignals, setProof, proof, publicSignals } = props;

    async function calculateProof(setPublicSignals: (arg0: snarkjs.PublicSignals) => void, setProof: (arg0: snarkjs.Groth16Proof) => void) {

        const { proof, publicSignals } =
            await snarkjs.groth16.fullProve({
                in: [1, 2, 3, 4, 5]
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
            <button className="btn btn-blue" onClick={() => calculateProof(setPublicSignals, setProof)}>Calculate Proof</button>
            {
                proof && (
                    <div className="result-box">
                        <div>
                            Proof:
                        </div>
                        <br />
                        {JSON.stringify(proof)}
                    </div>
                )
            }
            {
                publicSignals && (
                    <div className="result-box">
                        <div>
                            Public Signals:
                        </div>
                        <br />
                        {publicSignals}
                    </div>
                )
            }
        </>
    )
}


