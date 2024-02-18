import { CHAIN_ID, SMART_CONTRACT_ADDRESS } from '../../../constants'

import * as snarkjs from 'snarkjs';

import { readContract } from '@wagmi/core'

import { useEffect, useState } from 'react'

export default function VerifyProof(props: { publicSignals: snarkjs.PublicSignals | undefined, proof: snarkjs.Groth16Proof | undefined }) {
    const { proof, publicSignals } = props;

    const [clickButton, setClickButton] = useState(true);
    const [proofIsValid, setProofIsValid] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (proof && publicSignals) {
            const fetchData = async () => {

                const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

                const argv = calldata
                    .replace(/["[\]\s]/g, "")
                    .split(",")
                    .map((x) => BigInt(x).toString());

                const a = [argv[0], argv[1]];
                const b = [
                    [argv[2], argv[3]],
                    [argv[4], argv[5]],
                ];
                const c = [argv[6], argv[7]];

                const data = await readContract({
                    address: SMART_CONTRACT_ADDRESS,
                    chainId: Number(CHAIN_ID),
                    abi: [
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256[2]",
                                    "name": "a",
                                    "type": "uint256[2]"
                                },
                                {
                                    "internalType": "uint256[2][2]",
                                    "name": "b",
                                    "type": "uint256[2][2]"
                                },
                                {
                                    "internalType": "uint256[2]",
                                    "name": "c",
                                    "type": "uint256[2]"
                                },
                                {
                                    "internalType": "uint256[1]",
                                    "name": "input",
                                    "type": "uint256[1]"
                                }
                            ],
                            "name": "verifyProof",
                            "outputs": [
                                {
                                    "internalType": "bool",
                                    "name": "r",
                                    "type": "bool"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        }
                    ],
                    functionName: 'verifyProof',
                    args: [a, b, c, publicSignals],
                })
                setProofIsValid(data as boolean)
            }

            fetchData().catch(console.error);
        }
    }, [clickButton])

    return (
        <>
            <button className="btn btn-blue" onClick={() => {
                setProofIsValid(undefined)
                setClickButton(!clickButton);
            }} >
                Verify Proof In Smart Contract
            </button>
            {proofIsValid !== undefined && (
                <>
                    <br />
                    <div className={`result-box ${proofIsValid !== undefined ? '' : 'invisible'}`}>
                        Your proof is {proofIsValid ? 'valid.' : 'not valid.'}
                    </div>
                </>
            )}

        </>
    )
}


