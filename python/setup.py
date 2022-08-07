import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="ergonames",
    version="0.4.0",
    author="ErgoNames",
    author_email="developer@ergonames.com",
    description="A SDK for resolving ErgoNames.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/ergonames/ergo-names-python-sdk",
    project_urls={
        "Bug Tracker": "https://github.com/ergonames/ergo-names-python-sdk/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    package_dir={"": "ergonames"},
    packages=setuptools.find_packages(where="ergonames"),
    python_requires=">=3.6",
)