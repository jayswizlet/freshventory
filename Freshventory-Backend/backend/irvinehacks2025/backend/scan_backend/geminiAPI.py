from inference_sdk import InferenceHTTPClient
from typing import Sequence
from google.cloud import vision
import io

# ROBOFLOW API
def food_object_detector(image_path):
    """
    Detects food items in an image using the Roboflow object detection API.

    Args:
        image_path (str): The path to the image file to analyze.

    Returns:
        None: Prints the unique food classes detected in the image.

    Raises:
        FileNotFoundError: If the image file does not exist at the specified path.
        HTTPError: If there is an error with the API call.
    """
    CLIENT = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="X2ztjBd1fkNwfVwJKQKv"
    )

    result = CLIENT.infer(image_path, model_id="aicook-lcv4d/3")

    predictions = result["predictions"]

    unique_classes = {pred["class"] for pred in predictions}  # Use a set to ensure uniqueness
    for item in unique_classes:
        print(item)

# GOOGLE CLOUD VISION API
def google_text_detector(image_path):
    """
    Detects objects in a given image using Google Cloud Vision API.

    Args:
        image_path (str): Path to the image file to be analyzed.

    Returns:
        None: Prints the detected objects, their confidence scores, and their bounding polygon vertices.
    """
    client = vision.ImageAnnotatorClient.from_service_account_file("backend/scan_backend/vision_key.json")

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    
    response = client.text_detection(image=image)
    texts = response.text_annotations
    
    if not texts:
        print("No text detected in the image.")
        return []
    
    print("Texts:")
    for text in texts:
        print(f'\n"{text.description}"')

        vertices = [
            f"({vertex.x},{vertex.y})" for vertex in text.bounding_poly.vertices
        ]

        print("bounds: {}".format(",".join(vertices)))
        
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
        
    detected_texts = []
    for text in texts:
        bounds = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
        detected_texts.append({"text": text.description, "bounds": bounds})
        
    return detected_texts

def process_detected_texts(detected_texts):
    """
    Processes the detected text and bounds to group and print each object's text as a single string.

    Args:
        detected_texts (list): List of dictionaries with detected text and their corresponding bounds.

    Returns:
        None: Prints each object's text as a single string.
    """
    objects = []  # To store grouped text for each object
    current_object = []

    for i, text_info in enumerate(detected_texts):
        text = text_info['text']
        bounds = text_info['bounds']

        if current_object and not is_part_of_same_object(current_object[-1]['bounds'], bounds):
            # Start a new object if the current text is not part of the same object
            objects.append(" ".join([obj['text'] for obj in current_object]))
            current_object = []

        # Add the current text to the object
        current_object.append({'text': text, 'bounds': bounds})

    # Add the last object
    if current_object:
        objects.append(" ".join([obj['text'] for obj in current_object]))

    # Print the results
    print("Detected Objects as Strings:")
    for obj in objects:
        print(obj)


def is_part_of_same_object(bounds1, bounds2):
    """
    Determines if two bounding boxes belong to the same object based on proximity.

    Args:
        bounds1 (tuple): Bounds of the first box.
        bounds2 (tuple): Bounds of the second box.

    Returns:
        bool: True if the boxes are part of the same object, False otherwise.
    """
    # A simplistic check: if the bounding boxes are close in the y-axis
    return abs(bounds1[1][1] - bounds2[1][1]) < 20

def main():
    image_path = "images/label detection sample.jpg"
    detected_texts = google_text_detector(image_path)
    process_detected_texts(detected_texts)
    
if __name__ == "__main__":
    main()
    