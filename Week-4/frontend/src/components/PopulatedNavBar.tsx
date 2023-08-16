import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "@/components/nav/NavBar";
import NavDropdown from "@/components/nav/NavDropdown";
import NavItem from "@/components/nav/NavItem";

const PopulatedNavBar = () => {
    return (
        <NavBar>
            <NavItem>SPEED</NavItem>
            <NavItem route="/" end>
                Home
            </NavItem>
            <NavItem dropdown route="/articles">
                Articles <IoMdArrowDropdown />
                <NavDropdown>
                    <NavItem route="/articles">View articles</NavItem>
                    <NavItem route="/articles/new">Submit new</NavItem>
                </NavDropdown>
            </NavItem>
        </NavBar>
    );
};
export default PopulatedNavBar;