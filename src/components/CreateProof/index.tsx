import * as snarkjs from 'snarkjs';

export default function CreateProof(props: {
    setPublicSignals: (arg0: snarkjs.PublicSignals) => void | undefined,
    setProof: (args0: snarkjs.Groth16Proof) => void | undefined,
    proof: snarkjs.Groth16Proof | undefined
}) {
    const { setPublicSignals, setProof, proof } = props;

    async function calculateProof(setPublicSignals: (arg0: snarkjs.PublicSignals) => void, setProof: (arg0: snarkjs.Groth16Proof) => void) {

        const { proof, publicSignals } =
            await snarkjs.groth16.fullProve({
                in: [1, 2, 3, 4, 5]
            }, "./average.wasm", "./average.zkey");

        console.log("proof: ")
        console.log(JSON.stringify(proof))
        console.log("publicSignals: " + publicSignals)

        setPublicSignals(publicSignals)
        setProof(proof)

        const vkey = await fetch("average.vkey.json").then(function (res) {
            return res.json();
        });

        console.log("vkey:")
        console.log(vkey)
        const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
        console.log("res")
        console.log(res)
    }
    return (
        <>
            <button onClick={() => calculateProof(setPublicSignals, setProof)}>Calculate Proof</button>
            {
                proof && (
                    <div className="text-green">
                        {JSON.stringify(proof)}
                    </div>
                )
            }
        </>
    )
}


