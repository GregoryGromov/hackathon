import argparse
import csv


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    with open(args.input, newline="", encoding="utf-8") as source:
        reader = csv.DictReader(source)
        rows = list(reader)

    with open(args.output, "w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=["row_id", "action"])
        writer.writeheader()
        for row in rows:
            writer.writerow({"row_id": row["row_id"], "action": "A1"})


if __name__ == "__main__":
    main()
