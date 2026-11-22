import { NavLink } from 'react-router-dom'

function NotFound() {
    return (
        <section>
            <div className="not-found">
                <p>Sorry, the page you were looking for couldn't be found.</p>
                <NavLink to="/browse">Find a Quiz</NavLink>
            </div>
        </section>
    )
}

export default NotFound