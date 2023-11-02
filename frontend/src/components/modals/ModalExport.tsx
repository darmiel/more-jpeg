import { Recipe } from "@/util/recipe"
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"

export default function ModalExport({ recipe }: { recipe: Recipe }) {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Export Recipe</ModalHeader>
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
