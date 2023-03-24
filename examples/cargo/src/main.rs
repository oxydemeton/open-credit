use random::Source;
fn main() {
    let mut source = random::default(42);
    println!("Dice Roll: {}", source.read::<isize>()%6);
}
