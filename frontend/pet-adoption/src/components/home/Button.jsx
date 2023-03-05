import { Button as BootstrapButton } from 'react-bootstrap';
import "./Button.css"

export function Button(props) {
    const { text, onClick } = props;

    return (
        <>
            <BootstrapButton
                className='custom-button'
                variant="dark"
                onClick={onClick}>
                {text}
            </BootstrapButton>
        </>
    )
}
