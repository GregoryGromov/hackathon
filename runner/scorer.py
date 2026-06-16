#!/usr/bin/env python3
import argparse
import importlib.util
import json
import os
import sys
import traceback
from pathlib import Path

from utils import ScorerStepByStep


def find_solution_file(solution_root: Path) -> Path:
    if solution_root.is_file() and solution_root.name == "solution.py":
        return solution_root

    matches = sorted(solution_root.rglob("solution.py"))
    if not matches:
        raise FileNotFoundError("Archive must contain solution.py.")
    if len(matches) > 1:
        raise ValueError("Archive must contain exactly one solution.py.")
    return matches[0]


def load_prediction_model(solution_root: Path):
    solution_file = find_solution_file(solution_root)
    solution_dir = solution_file.parent
    package_root = Path(__file__).resolve().parent

    for path in (str(package_root), str(solution_dir), str(solution_root)):
        if path not in sys.path:
            sys.path.insert(0, path)

    spec = importlib.util.spec_from_file_location("submission_solution", solution_file)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load {solution_file}.")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    if not hasattr(module, "PredictionModel"):
        raise AttributeError("solution.py must define PredictionModel.")

    return module.PredictionModel()


def main() -> int:
    parser = argparse.ArgumentParser(description="Run an Action Arena submission")
    parser.add_argument("--data", required=True, help="Path to parquet test dataset")
    parser.add_argument("--solution", required=True, help="Path to extracted solution directory")
    parser.add_argument("--output", required=True, help="Path to output score JSON")
    args = parser.parse_args()

    data_path = Path(args.data)
    solution_root = Path(args.solution)
    output_path = Path(args.output)

    if not data_path.is_file():
        raise FileNotFoundError(f"Dataset not found: {data_path}")
    if not solution_root.exists():
        raise FileNotFoundError(f"Solution not found: {solution_root}")

    model = load_prediction_model(solution_root)
    scorer = ScorerStepByStep(str(data_path))
    results = scorer.score(model)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(
            {
                "score": results["weighted_pearson"],
                "rows_scored": results["rows_scored"],
                "metrics": {
                    key: value
                    for key, value in results.items()
                    if key not in {"weighted_pearson", "rows_scored"}
                },
            },
            indent=2,
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    print(f"weighted_pearson={results['weighted_pearson']:.6f}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception:
        traceback.print_exc(file=sys.stderr)
        raise SystemExit(1)
