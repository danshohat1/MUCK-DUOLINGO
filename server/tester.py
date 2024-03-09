"""
    Auto tester
    Author: Ayelet Mashiah

    a file managing automatic tests for student exercises
"""
import pep8
import os
import sys
import glob


def test_pep8(folder, files):
    """
    runs pep8 test using pep8 library
    """
    tst_f_name = os.path.basename(sys.argv[0])
    files.remove(".\\" + tst_f_name)
    print("tested files", files)
    checker = pep8.StyleGuide()
    checker.check_files(files)


def list_files(folder):
    """
    Returns a list of all Python files in
    the specified folder and its subfolders,
    ignoring specified directories such as 'venv', '.idea', and '__pycache__'.
    """
    ignored_dirs = {'venv', '.idea', '__pycache__'}
    python_files = []

    for root, dirs, files in os.walk(folder, topdown=True):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        python_files += [os.path.join(root, file) for file in files
                         if file.endswith('.py')]

    return python_files


def test_folder(folder_name):
    """
    inputs:
        - folder to be tested
    1 - generates a list of full paths of the fiven folder
    2 - runs pep8 tests on the given list files
    3 - output results to stdout
    """
    new_tested_files = list_files(folder_name)
    test_pep8(folder_name, new_tested_files)


def main():
    """
    goes over students folders
    for each folder it tests:
        - requested method
        - pep8
        - documentation

    given parameters:`
        1 - root folder of all students sub folders
        2 - code testing file name
        3 - name of file to test

    TBD - if not all files should be run
    """
    test_folder(".")


if __name__ == '__main__':
    main()