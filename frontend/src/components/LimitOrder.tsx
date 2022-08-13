import {Form, Formik} from 'formik';
import {signDaiPermitTxAndSendToken} from "../order/limitOrder";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {CHAIN_ID} from "../utils/constants";

type LimitOrder = {
    amount: string;
    minReturn: string;
}

const getInitialValues: () => LimitOrder = () => ({
    amount: "1",
    minReturn: "1"
})

const applyLimitOrder = async (limitOrder: LimitOrder) => {
    signDaiPermitTxAndSendToken(`${limitOrder.amount}`, `${limitOrder.minReturn}`);
}

export const LimitOrder = () => {
    const {chainId, account, active} = useWeb3React<Web3Provider>();
    if (!active || !account || chainId !== CHAIN_ID.MATIC) {
        return (
            <div>ONLY POLYGON SUPPORTED</div>
        )
    }

    return (
        <Formik
            initialValues={getInitialValues()}
            onSubmit={applyLimitOrder}
            enableReinitialize={true}
        >
            {({handleSubmit, values, setFieldValue}) => (
                <Form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <label htmlFor="amount">
                                DAI amount:
                            </label>
                            <div>
                                <input
                                    type="number"
                                    step=".1"
                                    name="amount"
                                    placeholder="amount"
                                    value={values.amount}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
                                    ) => {
                                        const newValue = e.target.value ? +e.target.value : 0;
                                        setFieldValue('amount', newValue,);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="amount">
                                MATIC min return:
                            </label>
                            <div>
                                <input
                                    type="number"
                                    name="minReturn"
                                    placeholder="minReturn"
                                    step=".1"
                                    value={values.minReturn}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
                                    ) => {
                                        const newValue = e.target.value ? +e.target.value : 0;
                                        setFieldValue('minReturn', newValue,);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="button-apply">
                                Send order
                            </button>
                        </div>
                    </div>

                </Form>
            )}
        </Formik>
    );
};
