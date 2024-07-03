import { Box, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';
import BasicCard from '../basicCard/BasicCard';
import { IAnswer, IQuestion } from 'utils/interfaces';

interface IQuizCardProps {
    question: IQuestion;
    mode: 'exam' | 'result';
    answer?: string;
    showAnswer?: boolean;
    children?: React.ReactNode;
    onChange?: (answer: IAnswer) => void;
}

const QuizCard: React.FC<IQuizCardProps> = (props: IQuizCardProps) => {
    const [state, setState] = React.useState<{
        answered: boolean;
        isCorrect: boolean;
        radioValue: string;
        checkboxValue: string[];
        textValue: string;
    }>({
        answered: false,
        isCorrect: false,
        radioValue: '',
        checkboxValue: [],
        textValue: ''
    });
    const hasMounted = React.useRef(false);
    React.useEffect(() => {
        if (hasMounted.current) {
            if (props.question.type === 'single') {
                const isCorrect = state.radioValue.toLowerCase() === props.question.correctAnswer.toLowerCase();
                props.onChange && props.onChange({
                    question: props.question,
                    isCorrect,
                    answer: state.radioValue,
                })
                setState({ ...state, isCorrect });
            }
            if (props.question.type === 'multiple') {
                const isCorrect = state.checkboxValue.sort().join('').toLowerCase() === props.question.correctAnswer.toLowerCase();
                props.onChange && props.onChange({
                    question: props.question,
                    isCorrect,
                    answer: state.checkboxValue.sort().join(''),
                })
                setState({ ...state, isCorrect });
            }
            if (props.question.type === 'text') {
                const isCorrect = state.textValue.toLowerCase() === props.question.correctAnswer.toLowerCase();
                props.onChange && props.onChange({
                    question: props.question,
                    isCorrect,
                    answer: state.textValue,
                })
                setState({ ...state, isCorrect });
            }
        } else {
            hasMounted.current = true;
        }
    }, [state.checkboxValue, state.radioValue, state.textValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.checked) {
            setState({
                ...state,
                checkboxValue: [...state.checkboxValue, value],
                // answered: true
            });
        } else {
            setState({
                ...state,
                checkboxValue: state.checkboxValue.filter((item) => item !== value),
            });
        }
    }
    return (
        <BasicCard >
            <div>
                {
                    props.question.type === 'single' && (
                        <Box>
                            <h2>{props.question.idRec + '. ' + props.question.question}</h2>
                            {props.children}
                            <RadioGroup
                                name={props.question.idRec}
                                onChange={(_, value) => {
                                    setState(
                                        { ...state, radioValue: value }
                                    )
                                }}
                                defaultValue={props.answer}

                            >
                                {
                                    props.question.options.map((option, index) => (
                                        <Box key={option.value}>
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                label={option.value + '. ' + option.label}
                                                control={<Radio />}
                                                disabled={props.mode === 'result'}
                                            />
                                        </Box>

                                    ))
                                }
                            </RadioGroup>
                        </Box>
                    )
                }
                {
                    props.question.type === 'multiple' && (
                        <div>
                            <h2>{props.question.idRec + '. ' + props.question.question}</h2>
                            {props.children}
                            <FormControl>
                                {
                                    props.question.options.map((option, index) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            label={option.value + '. ' + option.label}
                                            disabled={props.mode === 'result'}
                                            control={
                                                <Checkbox
                                                    defaultChecked={props.answer?.includes(option.value) ? true : false}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                />
                                            }
                                        />
                                    ))
                                }
                            </FormControl>
                        </div>
                    )
                }
                {
                    props.question.type === 'text' && (
                        <div>
                            <h2>{props.question.idRec + '. ' + props.question.question}</h2>
                            {props.children}
                            <TextField
                                sx={{ margin: '10px 0' }}
                                type='text'
                                disabled={props.mode === 'result'}
                                defaultValue={props.answer}
                                onChange={(e) => {
                                    setState({ ...state, textValue: e.target.value })
                                }}
                            />
                        </div>
                    )
                }
                {
                    (props.showAnswer || props.mode === 'result')
                    && (
                        <div>
                            {
                                props.mode === 'exam' &&
                                <Button variant='contained' onClick={() => setState({ ...state, answered: !state.answered })}>Answer</Button>
                            }
                            {
                                (state.answered || props.mode === 'result') && (
                                    <div>
                                        <h3 >Correct Answer: {props.question.correctAnswer}</h3>
                                        <h3 >Is correct: {state.isCorrect ? 'true' : 'false'}</h3>
                                        <h3 >Explain: {props.question.explain}</h3>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>

        </BasicCard>
    );
};

export default QuizCard;