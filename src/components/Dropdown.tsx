import ChevronDown from "./icons/ChevronDown";
import ChevronUp from "./icons/ChevronUp";
import styled from "@emotion/styled";
import { useState } from "react";

const S = {
  DropdownContainer: styled.div`
    width: 125px;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    overflow: visible;
  `,

  DropdownLabel: styled.div`
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  DropdownList: styled.ul`
    position: absolute;
    top: 100%;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-height: 200px;
    overflow: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  `,

  DropdownOption: styled.li`
    padding: 8px 12px;
    &:hover {
      background-color: #f0f0f0;
    }
  `,
};

interface DropdownProps<T extends string> {
  options: T[];
  engToKor: Record<T, string>;
  handleChange: (option: T) => void;
}

function Dropdown<T extends string>({
  options,
  engToKor,
  handleChange,
}: DropdownProps<T>) {
  if (!options.length || Object.keys(engToKor).length !== options.length) {
    throw Error("options가 없거나 engToKor 객체가 올바르지 않습니다.");
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<T>(options[0]);

  const toggleDropdown = () => setIsOpen((isOpen) => !isOpen);

  const handleSelect = (option: T) => {
    setSelectedLabel(option);

    handleChange(option);
  };

  return (
    <S.DropdownContainer onClick={toggleDropdown}>
      <S.DropdownLabel>
        {engToKor[selectedLabel]}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </S.DropdownLabel>
      {isOpen && (
        <S.DropdownList>
          {options.map((option: T) => (
            <S.DropdownOption
              key={`dropdown-${option}`}
              onClick={() => {
                handleSelect(option);
              }}
            >
              {engToKor[option]}
            </S.DropdownOption>
          ))}
        </S.DropdownList>
      )}
    </S.DropdownContainer>
  );
}

export default Dropdown;
