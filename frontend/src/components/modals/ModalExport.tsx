import { Recipe } from "@/util/recipe"
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"
import { FaFileExport } from "react-icons/fa6"

export default function ModalExport({ recipe }: { recipe: Recipe }) {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="items-center space-x-2">
            <FaFileExport />
            <span>Export Recipe</span>
          </ModalHeader>
          <ModalBody>
            <Textarea
              variant="bordered"
              value={JSON.stringify(recipe, null, 2)}
              minRows={3}
              maxRows={20}
              readOnly
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}
